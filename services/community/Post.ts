export default interface Post {
    content: string;
    date: Date;
    uid: string;
    username: string;
    likes: number;
    comments: Array<String>;
}