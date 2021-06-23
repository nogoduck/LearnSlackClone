import fetcher from "../../utils/fetcher";
import axios from "axios";
import React, { FC, useCallback, useState } from "react";
import useSWR, { mutate } from "swr";
import { Link, Redirect } from "react-router-dom";
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from "./styles";
import gravatar from "gravatar";
import Menu from "../../components/Menu";
import { IUser } from "../../typings/db";
import Modal from "../../components/Modal";
import { Button, Input, Label } from "../../pages/SignUp/styles";
import useInput from "../../hooks/useInput";
//FC타입안에 children이 들어있고 children을 사용하지 않는 컴포넌트는 VFC를 해주면 된다
const Workspace: FC = ({ children }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] =
    useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput("");
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput("");

  const {
    data: userData,
    error,
    revalidate,
  } = useSWR<IUser | false>("http://localhost:3095/api/users", fetcher, {
    //타입을 명시하고 로그인이 안되어있을수도 있기에 조건을 추가한다 <IUser |false>
    dedupingInterval: 2000, //2초내로는 같은것을 호출하면 요청을 보내지 않고 캐시된것을 그대로 사용한다.
  });
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

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onCreateWorkspace = useCallback(() => {}, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
  }, []);

  if (!userData) {
    return <Redirect to="/signin" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg
              src={gravatar.url(userData.email, { s: "28px", d: "retro" })}
              alt={userData.nickname}
            />
            {showUserMenu && (
              <Menu
                style={{ right: 0, top: 38 }}
                show={showUserMenu}
                onCloseModal={onClickUserProfile}
              >
                <ProfileModal>
                  <img
                    src={gravatar.url(userData.email, {
                      s: "36px",
                      d: "retro",
                    })}
                    alt={userData.nickname}
                  />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
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
        <Workspaces>
          {userData.Workspaces.map((ws) => {
            return (
              <Link to={`/workspace/${123}/channel/일반`} key={ws.id}>
                <WorkspaceButton>
                  {ws.name.slice(0, 1).toUpperCase()}
                </WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>Menu Scroll</MenuScroll>
        </Channels>
        <Chats>{children}</Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input
              id="workspace"
              value={newWorkspace}
              onChange={onChangeNewWorkspace}
            ></Input>
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 URL</span>
            <Input
              id="workspace"
              value={newUrl}
              onChange={onChangeNewUrl}
            ></Input>
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Workspace;
