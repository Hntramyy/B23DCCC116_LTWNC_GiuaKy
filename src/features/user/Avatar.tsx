import { UserIcon } from '../../components/icons';

interface AvatarProps {
  size?: 'sm' | 'lg';
}

export function Avatar({ size = 'sm' }: AvatarProps) {
  const iconSize = size === 'lg' ? 24 : 16;
  return (
    <span className={`avatar avatar-${size}`} aria-hidden="true">
      <UserIcon width={iconSize} height={iconSize} />
    </span>
  );
}
