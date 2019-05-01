import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamsComponent } from '../components/streams/streams.component';
import { TokenService } from '../services/token.service';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { SideComponent } from '../components/side/side.component';
import { PostFormsComponent } from '../components/post-forms/post-forms.component';
import { PostsComponent } from '../components/posts/posts.component';

@NgModule({
  declarations: [
    StreamsComponent,
    ToolbarComponent,
    SideComponent,
    PostFormsComponent,
    PostsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [StreamsComponent,ToolbarComponent,PostFormsComponent,PostsComponent],
  providers: [TokenService]
})
export class StreamsModule { }
