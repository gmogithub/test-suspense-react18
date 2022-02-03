import { sleep } from "./utils";

export async function fetchPosts() {
  return fetch(`http://jsonplaceholder.typicode.com/posts/1`).then((res) => {
    return sleep(4000).then(() => res.json());
  })
}

export async function fetchPosts2() {
  return fetch(`http://jsonplaceholder.typicode.com/posts/2`).then((res) => {
    return sleep(4000).then(() => res.json());
  })
}


export async function fetchPosts3() {
  return fetch(`http://jsonplaceholder.typicode.com/posts/3`).then((res) => {
    return sleep(4000).then(() => res.json());
  })
}