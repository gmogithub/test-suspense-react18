import { useEffect, useMemo, useState } from "react";

enum PromiseStatusEnum {
  PENDING,
  SUCCESS,
  ERROR
}

type FunctionPromiseSuspender<P = any> = (p?: P) => Promise<P | undefined>

interface Suspenders<P> {
  key: string,
  func: FunctionPromiseSuspender<P>,
  status: PromiseStatusEnum,
  promise?: Promise<P | undefined>,
  result?: P,
  error?: any
}

class ObserverPromiseSuspender<P = any> {
  private suspenders: Suspenders<P>[] = [];

  add(key: string, func: FunctionPromiseSuspender<P>) {
    this.suspenders.push({ key: key, func, status: PromiseStatusEnum.PENDING });
  }

  remove(key: string) {
    const index = this.suspenders.findIndex(s => s.key === key);
    this.suspenders.splice(index, 1);
  }

  get(key: string): Suspenders<P> | undefined {
    const s = this.suspenders.find((s => s.key === key));
    if (s) {
      return s;
    }

    return undefined;
  }

  exists(key: string) {
    return this.suspenders.findIndex(s => s.key === key) !== -1;
  }

  getStatus(key: string) {
    return this.suspenders.find(s => s.key === key)!.status;
  }

  wrapPromise(key: string, promise: Promise<P | undefined>) {
    const suspender = this.get(key)!;


    promise.then((r) => {
        suspender.status = PromiseStatusEnum.SUCCESS;
        suspender.result = r;
      },
      (e) => {
        suspender.status = PromiseStatusEnum.ERROR;
        suspender.error = e;
      });

    return {
      read() {
        if (suspender.status === PromiseStatusEnum.PENDING) {
          throw promise;
        } else if (suspender.status === PromiseStatusEnum.ERROR) {
          throw  suspender.error;
        } else if (suspender.status === PromiseStatusEnum.SUCCESS) {
          return suspender.result;
        }
      }
    }
  }

  launch(key: string, force: boolean = false) {
    const suspender = this.get(key)!;
    let promise = suspender.promise;
    if (!promise || force) {
      promise = suspender.func();
      suspender.promise = promise;
    }

    this.wrapPromise(key, promise).read();
    return suspender.result;
  }

  refresh(func: FunctionPromiseSuspender<P>) {

    return func();
  }


}

const observer = new ObserverPromiseSuspender();


export function useApiQuerySuspense<P = any>(keyQuery: string, func: FunctionPromiseSuspender<P>) {
  const [data, setData] = useState<P>();
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {

    return () => {
      if (observer.exists(keyQuery)) {
        observer.remove(keyQuery);
      }
    }

  }, [keyQuery]);

  useMemo(() => {
    if (!observer.exists(keyQuery)) {
      observer.add(keyQuery, func);
    }

    const result = observer.launch(keyQuery);
    setData(result);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyQuery]);

  function reload() {
    setLoading(true);
    func().then((res) => {
      setData(res);
      setLoading(false);
    });

  }

  return { data, loading, reload }
}