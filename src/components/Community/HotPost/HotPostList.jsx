import PostItem from '@/components/Community/PostItem';

const HotPostsList = ({ posts, maxItems = 5 }) => {
  const displayPosts = posts.slice(0, maxItems);

  return (
    <div className="flex flex-col">
      {displayPosts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
};

export default HotPostsList;
