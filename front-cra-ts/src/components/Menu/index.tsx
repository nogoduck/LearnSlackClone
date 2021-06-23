import React, { FC, useCallback, CSSProperties } from "react";
import { CreateMenu, CloseModalButton } from "./styles";

interface Props {
  show: boolean;
  onCloseModal: () => void;
  style: CSSProperties;
  closeButton?: boolean;
}

const Menu: FC<Props> = ({
  children,
  style,
  show,
  onCloseModal,
  closeButton,
}) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation(); //부모태그로 이벤트가 전달되지 않는다
  }, []);

  return (
    <CreateMenu onClick={onCloseModal}>
      <div style={style} onClick={stopPropagation}>
        {closeButton && (
          <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        )}
        {children}
      </div>
    </CreateMenu>
  );
};

Menu.defaultProps = {
  closeButton: true,
};
export default Menu;