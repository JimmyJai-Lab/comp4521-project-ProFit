export default interface Post {
    id: string;
    content: string;
    date: Date;
    uid: string;
    username: string;
    likes: number;
    comments: Array<String>;
}