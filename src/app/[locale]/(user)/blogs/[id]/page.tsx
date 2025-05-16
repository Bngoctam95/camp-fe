export default function BlogDetailPage({ params }: { params: { id: string } }) {
        return (
                <div>
                        <h1>Chi tiết bài viết blog: {params.id}</h1>
                </div>
        );
} 