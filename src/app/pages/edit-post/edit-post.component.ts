import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../shared/models/Post';
import { PostService } from '../../shared/services/post.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-edit-post',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.scss'
})
export class EditPostComponent implements OnInit{
  postId?: string;
  post?: Post | null;
  postForm!: FormGroup;

  @Input()
  set id(id: string) {
    this.postId = id;
  }

  constructor(
    private fb: FormBuilder,
    private postService: PostService
  ){ }

  async ngOnInit(): Promise<void> {
    this.initializeForm();
    this.post = await this.postService.getPostById(this.postId!);
  }

  initializeForm(): void {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(10)]]
    });
  }
  
  editPost() {
    if (this.postForm.valid) {
            const formValue = this.postForm.value;
            
            const newPost: Partial<Post> = {
              title: formValue.title,
              content: formValue.content,
              postedBy: this.post!.postedBy,
              date: new Date(Date.now())
            };
            
            this.postService.updatePost(this.postId!, newPost)
              .then(()=> {
                console.log("Update successful");
              });
          } else {
            Object.keys(this.postForm.controls).forEach(key => {
              const control = this.postForm.get(key);
              control?.markAsTouched();
            });
          }
  }
}
