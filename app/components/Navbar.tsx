interface NavbarProps {
  username: string;
}

export default function Navbar({ username }: NavbarProps) {
  return (
    <nav className="flex justify-end p-4">
      <div className="text-gray-600 dark:text-gray-300">
        Welcome, {username} | <a href="/logout" className="text-blue-600 hover:underline">Logout</a>
      </div>
    </nav>
  );
} 