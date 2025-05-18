import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { Post } from '../../shared/models/Post';
import { PostService } from '../../shared/services/post.service';

@Component({
  selector: 'app-edit-post',
  imports: [],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.scss'
})
export class EditPostComponent implements OnInit{
  postId?: string;
  post?: Post | null;

  constructor(
    private postService: PostService
  ){ }

  async ngOnInit(): Promise<void> {
    this.post = await this.postService.getPostById(this.postId!);
  }

  @Input()
  set id(id: string) {
    this.postId = id;
  }
}
