import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
import { PostsComponent } from './pages/posts/posts.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MenuComponent } from "./shared/menu/menu.component";
import { NotFoundComponent } from './pages/not-found/not-found.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeComponent, PostsComponent, ProfileComponent, MenuComponent, NotFoundComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'webkert-honlap';

  page = "home";

  changePage(selectedPage: string){
    this.page = selectedPage;
  }
}
