export default function ArticleDetailPage({ params }: { params: { id: string } }) {
        return (
                <div>
                        <h1>Chi tiết bài viết: {params.id}</h1>
                </div>
        );
} 