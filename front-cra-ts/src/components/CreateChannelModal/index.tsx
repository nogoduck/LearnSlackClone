import React, { useCallback, FC } from "react";
import useInput from "../../hooks/useInput";
import { Button, Input, Label } from "../../pages/SignUp/styles";
import Modal from "../Modal";

interface Props {
  show: boolean;
  onCloseModal: () => void;
}

const CreateChannelModal: FC<Props> = ({ show, onCloseModal }) => {
  const [newChannel, onChangeNewChannel] = useInput("");
  const onCreateChannel = useCallback(() => {}, []);

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
