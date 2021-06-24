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
  WorkspaceModal,
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
import { toast } from "react-toastify";
import CreateChannelModal from "../../components/CreateChannelModal";
//FC타입안에 children이 들어있고 children을 사용하지 않는 컴포넌트는 VFC를 해주면 된다
const Workspace: FC = ({ children }) => {
  //input같은 경우 다른 컴포넌트로 분리해주면 최적화에 도움이된다
  //입력이 될때마다 해당 컴포넌트가 리랜더링이 되기때문에 분리하여 독립적으로 사용하기 위함
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] =
    useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
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

  const onCloseUserProfile = useCallback((e) => {
    console.log("Profile Menu Close");
    e.stopPropagation();
    setShowUserMenu(false);
  }, []);

  const onClickUserProfile = useCallback(() => {
    console.log("Profile Menu Open");
    setShowUserMenu((prev) => !prev); //
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    console.log("Create Modal Open");
    setShowCreateWorkspaceModal(true);
  }, []);

  const onCreateWorkspace = useCallback(
    (e) => {
      e.preventDefault();
      if (!newWorkspace || !newWorkspace.trim()) return; //필수값들이 작성되었나 검사, 띄어쓰기 하나만 입력햇을때 통과되는걸 막기 위해 trim 사용
      if (!newUrl || !newUrl.trim()) return;
      axios
        .post(
          "http://localhost:3095/api/workspaces",
          {
            workspace: newWorkspace,
            url: newUrl,
          },
          {
            withCredentials: true, //쿠키전달 (로그인상태)
          }
        )
        .then(() => {
          revalidate();
          setShowCreateWorkspaceModal(false);
          setNewWorkspace("");
          setNewUrl("");
        })
        .catch((err) => {
          console.dir(err);
          toast.error(error.response?.data, { position: "bottom-center" });
        });
    },
    [newWorkspace, newUrl]
  );

  const onCloseModal = useCallback(() => {
    console.log("Close All Modal");
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
  }, []);

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal((prev) => !prev);
  }, []);

  const onClickAddChannel = useCallback(() => {}, []);

  if (!userData) {
    //return은 반드시 모든 hooks 아래에 배치해야 하며, 반복문이나 조건문 내에 hooks를 적용하여도 오류가 발생한다.
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
                onCloseModal={onCloseUserProfile}
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
          <WorkspaceName onClick={toggleWorkspaceModal}>
            Sleact404
          </WorkspaceName>
          <MenuScroll>
            <Menu
              show={showWorkspaceModal}
              onCloseModal={toggleWorkspaceModal}
              style={{ top: 95, left: 80 }}
            >
              <WorkspaceModal>
                <h2>Sleact</h2>
                <button onClick={onClickAddChannel}>채널 만들기</button>
                <button onClick={onLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
          </MenuScroll>
        </Channels>
        <Chats>CHAT</Chats>
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
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
      />
    </div>
  );
};

export default Workspace;
