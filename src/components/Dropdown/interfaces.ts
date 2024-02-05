export interface DropdownCommonContextProps {
  isOpen: boolean;
  handleToggleDropdownMenu: () => void;
}

export interface DropdownItemProps {
  children: React.ReactNode;
  value: string | number | boolean;
  disabled?: boolean;
  modifierClass?: string;
}

export interface DropdownClickedItem {
  text: string;
  value: string | number | boolean;
}