import { computed, inject } from '@angular/core';
import { Post } from '@core/models/post.model';
import { Filter, PostGateway } from '@core/ports/post.gateway';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

type PostState = {
  posts: Post[];
  filter: Filter;
  isPosting: boolean;
};

export const PostStore = signalStore(
  withState<PostState>({
    posts: [],
    filter: { limit: 20, skip: 0 },
    isPosting: false,
  }),
  withComputed(({ posts }) => ({
    postsCount: computed(() => posts().length),
  })),
  withMethods((store, postGateway = inject(PostGateway)) => ({
    retrievePosts: rxMethod<void>(
      pipe(
        switchMap(() =>
          postGateway
            .findAll(store.filter())
            .pipe(tap((posts) => patchState(store, { posts })))
        )
      )
    ),
    updateFilter: (filter: Filter) => patchState(store, { filter }),
  })),
  withHooks({
    onInit(store) {
      store.retrievePosts();
    },
  })
);
