import React, { FC } from "react";
import { CreateModal, CloseModalButton } from "./styles";

const Modal: FC = ({ children }) => {
  return (
    <CreateModal>
      <div>Modal</div>
      {children}
    </CreateModal>
  );
};

export default Modal;
