export class ExtendedLikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: 'None';
  // myStatus: LikeStatus;
  newestLikes: {
    addedAt: string;
    userId: string;
    login: string;
  }[];
}
