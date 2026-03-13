import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const MainPage = () => {
  const [roomId, setRoomId] = useState<string>('');

  const navigate = useNavigate();

  const handleOnClick = () => {
    if (roomId === '') {
      return;
    }
    navigate(`/${roomId}`);
  };

  return (
    <main className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col gap-4">
        <Label className="mx-auto text-4xl" htmlFor="roomInputId">
          Enter room id
        </Label>
        <Input
          value={roomId}
          onChange={(e) => {
            setRoomId(e.target.value);
          }}
          id="roomInputId"
        />
        <Button onClick={handleOnClick}>Войти</Button>
      </div>
    </main>
  );
};
