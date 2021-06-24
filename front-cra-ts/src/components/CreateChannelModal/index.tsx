import axios from "axios";
import React, { useCallback, VFC } from "react";
import { useParams } from "react-router-dom";
import useInput from "../../hooks/useInput";
import { Button, Input, Label } from "../../pages/SignUp/styles";
import Modal from "../Modal";
import { toast } from "react-toastify";

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: VFC<Props> = ({ show, onCloseModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput("");
  const { workspace, channel } =
    useParams<{ workspace: string; channel: string }>(); //주소에서 데이터 가져오기
  const onCreateChannel = useCallback(
    (e) => {
      e.preventDefault();
      axios
        .post(
          "/api/workspaces/channels",
          { name: newChannel },
          {
            withCredentials: true,
          }
        )
        .then(() => {
          setShowCreateChannelModal(false);
          setNewChannel("");
        })
        .catch((err) => {
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
function setShowCreateChannelModal(arg0: boolean) {
  throw new Error("Function not implemented.");
}
