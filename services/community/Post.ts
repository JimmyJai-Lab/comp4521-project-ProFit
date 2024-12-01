export default interface Post {
    content: string;
    date: Date;
    uid: string;
    likes: number;
    comments: Array<String>;
}