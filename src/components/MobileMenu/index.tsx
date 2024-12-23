import Link from "next/link";

export default function MobileMenu({pathname}: {pathname: string}) {
    return (
        <div className="md:hidden absolute top-16 right-5 z-10 bg-white shadow-lg p-5">
            <ul className="flex flex-col gap-5">
                <li>
                    <Link href="/">
                        <span className={`${pathname === '/' ? 'font-bold text-green-600' : 'text-gray-700 hover:text-green-600'} font-semibold`}>
                            Home
                        </span>
                    </Link>
                </li>
                <li>
                    <Link href="/recipes">
                        <span className={`${pathname === '/recipes' ? 'font-bold text-green-600' : 'text-gray-700 hover:text-green-600'} font-semibold`}>
                            Recipes
                        </span>
                    </Link>
                </li>
                <li>
                    <Link href="/healty-tips">
                        <span className={`${pathname === '/healty-tips' ? 'font-bold text-green-600' : 'text-gray-700 hover:text-green-600'} font-semibold`}>
                            Healthy Tips
                        </span>
                    </Link>
                </li>
                <li>
                    <Link href="/about">
                        <span className={`${pathname === '/about' ? 'font-bold text-green-600' : 'text-gray-700 hover:text-green-600'} font-semibold`}>
                            About
                        </span>
                    </Link>
                </li> 
            </ul>

        </div>
    );
}