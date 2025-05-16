'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateBlogPage() {
        const router = useRouter();

        // Giả lập kiểm tra xác thực (thực tế sẽ dùng hệ thống auth thật)
        useEffect(() => {
                const isAuthenticated = localStorage.getItem('access_token');
                if (!isAuthenticated) {
                        router.push('/auth');
                }
        }, [router]);

        return (
                <div>
                        <h1>Tạo bài viết blog mới</h1>
                        {/* Form tạo blog sẽ được thêm ở đây */}
                </div>
        );
} 