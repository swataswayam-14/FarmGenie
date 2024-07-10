interface Props {
    id: string;
    currentUserId: string | null | undefined;
    parentId: string | null;
    content: string;
    author: {
        name: string;
        image: string;
        id: string;
    };
    community: {
        id:string;
        name: string;
        image: string;
    } | null;
    createdAt: string;
    comments:{
        author:{
            image: string;
        }
    }[]
    isComment?: boolean;
}

export const ThreadCard = ({
    id,
    currentUserId,
    parentId,
    content,
    author,
    community,
    createdAt,
    comments
}: Props) => {
    return (
        <article>
            <h2 className="text-small-regular text-light-2">
                {content}
            </h2>
        </article>
    )
}
