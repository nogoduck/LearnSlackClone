import fetcher from "../utils/fetcher";
import axios from "axios";
import React, { FC, useCallback } from "react";
import useSWR from "swr";
import { Redirect } from "react-router-dom";

//FC타입안에 children이 들어있고 children을 사용하지 않는 컴포넌트는 VFC를 해주면 된다
const Workspace: FC = ({ children }) => {
  const { data, error, revalidate } = useSWR(
    "http://localhost:3095/api/users",
    fetcher
  );
  const onLogout = useCallback(() => {
    axios
      .post("http://localhost:3095/api/users/logout", null, {
        withCredentials: true,
      })
      .then(() => {
        revalidate();
      });
  }, []);

  if (!data) {
    return <Redirect to="/signin" />;
  }

  return (
    <div>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
