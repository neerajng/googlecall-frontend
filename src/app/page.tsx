import { AuthWall } from '@/components/AuthWall';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <AuthWall />
    </div>
  );
}
