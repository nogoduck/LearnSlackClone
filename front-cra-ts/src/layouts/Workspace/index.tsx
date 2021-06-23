import fetcher from "../../utils/fetcher";
import axios from "axios";
import React, { FC, useCallback, useState } from "react";
import useSWR, { mutate } from "swr";
import { Redirect } from "react-router-dom";
import {
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from "./styles";
import gravatar from "gravatar";
import Menu from "../../components/Menu";
//FC타입안에 children이 들어있고 children을 사용하지 않는 컴포넌트는 VFC를 해주면 된다
const Workspace: FC = ({ children }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
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

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  if (!data) {
    return <Redirect to="/signin" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg
              src={gravatar.url(data.email, { s: "28px", d: "retro" })}
              alt={data.nickname}
            />
            {showUserMenu && (
              <Menu
                style={{ right: 0, top: 38 }}
                show={showUserMenu}
                onCloseModal={onClickUserProfile}
              >
                <ProfileModal>
                  <img
                    src={gravatar.url(data.email, { s: "36px", d: "retro" })}
                    alt={data.nickname}
                  />
                  <div>
                    <span id="profile-name">{data.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>Menu Scroll</MenuScroll>
        </Channels>
        <Chats>{children}</Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
