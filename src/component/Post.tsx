import React, { FC, useState } from "react";
import { useApiQuerySuspense } from "../hook/useApiQuery";
import { fetchPosts, fetchPosts2, fetchPosts3 } from "../repository";
import { Box, Button, Typography } from "@mui/material";

interface PostProps {

}

export const Post: FC<PostProps> = (props) => {
  const { data } = useApiQuerySuspense("fetch_posts", async () => {
    return fetchPosts();
  });

  const [count, setCount] = useState<number>(0)

  function handleClick() {
    setCount(prevCount => prevCount + 1);
  }

  if (!data) {
    return null;
  }

  return <Box> <Typography>{data.id}</Typography>

    <Typography variant={"h5"}>{data.title}</Typography>
    <Typography variant={"body1"}>{data.body}</Typography>
    <Button onClick={handleClick}>count {count} </Button>
  </Box>;
}


export const Post2: FC<PostProps> = (props) => {
  const { data } = useApiQuerySuspense("fetch_posts2", async () => {
    return fetchPosts2();
  });

  const [count, setCount] = useState<number>(0)

  function handleClick() {
    setCount(prevCount => prevCount + 1);
  }

  if (!data) {
    return null;
  }

  return <Box>
    <Typography>{data.id}</Typography>
    <Typography variant={"h5"}>{data.title}</Typography>
    <Typography variant={"body1"}>{data.body}</Typography>
    <Button onClick={handleClick}>count {count} </Button>
  </Box>;
}

export const Post3: FC<PostProps> = (props) => {
  const { data , reload, loading} = useApiQuerySuspense("fetch_posts3", async () => {
    return fetchPosts3();
  });

  const [count, setCount] = useState<number>(0);
  console.log(loading, "loading")

  function handleClick() {
    setCount(prevCount => prevCount + 1);
  }

  if (!data) {
    return null;
  }

  function handleClickRefresh() {
    reload();
  }

  return <Box>
    <Typography>{data.id} {loading ? "loading" : "loader"}</Typography>
    <Typography variant={"h5"}>{data.title}</Typography>
    <Typography variant={"body1"}>{data.body}</Typography>
    <Button onClick={handleClick}>count {count} </Button>
    <Button onClick={handleClickRefresh}>Refresh </Button>
  </Box>;
}