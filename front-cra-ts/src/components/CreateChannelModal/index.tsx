import axios from "axios";
import React, { useCallback, FC } from "react";
import { useParams } from "react-router-dom";
import useInput from "../../hooks/useInput";
import { Button, Input, Label } from "../../pages/SignUp/styles";
import Modal from "../Modal";
import { toast } from "react-toastify";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import { IChannel, IUser } from "../../typings/db";

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: FC<Props> = ({
  show,
  onCloseModal,
  setShowCreateChannelModal,
}) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput("");
  const { workspace } = useParams<{ workspace: string }>(); //주소에서 데이터 가져오기

  const { data: userData } = useSWR<IUser | false>("/api/users", fetcher);
  const { revalidate: revalidateChannel } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher
  );

  const onCreateChannel = useCallback(
    (e) => {
      e.preventDefault();
      if (!newChannel || !newChannel.trim()) {
        return;
      }
      axios
        .post(
          `http://localhost:3095/api/workspaces/${workspace}/channels`,
          { name: newChannel },
          {
            withCredentials: true,
          }
        )
        .then(() => {
          console.log("채널생성 성공");
          revalidateChannel();

          setShowCreateChannelModal(false);
          setNewChannel("");
        })
        .catch((err) => {
          console.log("채널생성 실패");
          console.dir(err);
          toast.error(err.response?.data, { position: "bottom-center" });
        });
    },
    [newChannel]
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널</span>
          <Input
            id="channel"
            value={newChannel}
            onChange={onChangeNewChannel}
          ></Input>
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
