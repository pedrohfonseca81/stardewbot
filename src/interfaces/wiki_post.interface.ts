interface IContent { title: string; content: string };

interface WikiPost {
    name: string;
    category: string;
    link: string;
    content: IContent[];
    thumbnail_image_url: string;
    image_url: string;
    language: string;
};

export default WikiPost;