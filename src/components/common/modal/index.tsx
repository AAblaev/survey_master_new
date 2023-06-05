import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  IModalComponentContentProps,
  IModalComponentFooterProps,
  IModalComponentHeaderProps,
  IModalComponentProps,
} from "./modal.types";
import { container, dialog, header, content, footer } from "./sc";

export const Modal: React.FC<IModalComponentProps> = ({
  children,
  visible,
  size,
  onClosed,
}) => {
  const didMount = useRef(false);
  const [shown, setShown] = useState(visible);
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    let timerId: any;
    if (didMount.current) {
      if (visible) {
        setMounted(true);
        timerId = setTimeout(() => setShown(true));
      } else {
        setShown(false);
        timerId = setTimeout(() => {
          setMounted(false);
          if (onClosed) onClosed();
        }, 200);
      }
    }
    return () => clearTimeout(timerId);
  }, [visible, onClosed]);

  useEffect(() => {
    didMount.current = true;
  }, []);

  return !mounted
    ? null
    : createPortal(
        <div
          css={container({ size, shown }) as any}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onWheel={(e) => {
            e.stopPropagation();
          }}
        >
          <div css={dialog({ size, shown })}>{children}</div>
        </div>,
        document.getElementById("root")!
      );
};

export const ModalHeader: React.FC<IModalComponentHeaderProps> = ({
  children,
}) => <div css={header}>{children}</div>;

export const ModalContent: React.FC<IModalComponentContentProps> = ({
  children,
}) => <div css={content}>{children}</div>;

export const ModalFooter: React.FC<IModalComponentFooterProps> = ({
  children,
}) => <div css={footer}>{children}</div>;
