import React from 'react';

interface AvatarProps {
  name: string;
  avatarUrl?: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ name, avatarUrl, size = 48 }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
  return avatarUrl ? (
    <img
      src={avatarUrl}
      alt={name}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }}
    />
  ) : (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#e0e7ef',
        color: '#2563eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: size / 2,
      }}
      aria-label={name}
    >
      {initials}
    </div>
  );
};

export default Avatar; 