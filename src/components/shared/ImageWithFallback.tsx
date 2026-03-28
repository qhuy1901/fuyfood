import { useState, type SyntheticEvent, type ImgHTMLAttributes } from 'react';

interface ImageWithFallbackProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  readonly src?: string | null;
  readonly fallbackSrc?: string;
}

const DEFAULT_IMAGE_SRC = '/default-restaurant.svg';

export default function ImageWithFallback({
  src,
  fallbackSrc = DEFAULT_IMAGE_SRC,
  alt,
  onError,
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const imageSrc = !src || hasError ? fallbackSrc : src;

  const handleError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true);
    }

    if (onError) {
      onError(event as any);
    }
  };

  return (
    <img
      {...props}
      src={imageSrc}
      alt={alt ?? ''}
      onError={handleError}
    />
  );
}
