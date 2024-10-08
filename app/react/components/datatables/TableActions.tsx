import clsx from 'clsx';
import { Children, PropsWithChildren } from 'react';

interface Props {
  className?: string;
}

export function TableActions({
  children,
  className,
}: PropsWithChildren<Props>) {
  if (Children.count(children) === 0) {
    return null;
  }

  return (
    <div className={clsx('flex gap-2 items-center', className)}>{children}</div>
  );
}
