import fetcher from "../../utils/fetcher";
import axios from "axios";
import React, { FC, useCallback } from "react";
import useSWR, { mutate } from "swr";
import { Redirect } from "react-router-dom";
import { Header, ProfileImg, RightMenu } from "./styles";

//FC타입안에 children이 들어있고 children을 사용하지 않는 컴포넌트는 VFC를 해주면 된다
const Workspace: FC = ({ children }) => {
  const { data, error, revalidate } = useSWR(
    "http://localhost:3095/api/users",
    fetcher,
    {
      dedupingInterval: 2000, //2초내로는 같은것을 호출하면 요청을 보내지 않고 캐시된것을 그대로 사용한다.
    }
  );
  const onLogout = useCallback(() => {
    axios
      .post("http://localhost:3095/api/users/logout", null, {
        withCredentials: true,
      })
      .then(() => {
        mutate("http://localhost:3095/api/users", false, false); //컴포넌트가 보일때 최초 1번 요청을 보내는데 그것마저 보내지 않기 위하여 mutate활용
      });
  }, []);

  if (!data) {
    return <Redirect to="/signin" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span>
            <ProfileImg src="http://placehold.it/30x30" />
          </span>
        </RightMenu>
      </Header>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
