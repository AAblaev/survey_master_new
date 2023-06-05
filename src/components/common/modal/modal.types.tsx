export type IModalSize = 'lg' | 'md' | 'sm' | 'fs';

export type IModalComponentProps = {
  children: React.ReactNode;
  visible: boolean;
  size?: IModalSize;
  onClosed?: () => void;
};

export type IModalComponentHeaderProps = {
  children: React.ReactNode;
};

export type IModalComponentContentProps = {
  children: React.ReactNode;
};

export type IModalComponentFooterProps = {
  children: React.ReactNode;
};
