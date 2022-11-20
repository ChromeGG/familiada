Fix this issues before MVP release:

1. Fix all FIXMEs
2. Adjust PostgreSQL version to Railway's one
3. Update npm packages
4. Fix building on Railway
   1. API service should just be building API, the same with web
   2. write Dockerimages for both services
   3. Set proper workflow (deploy staging if pushed to main, deploy production if tag is pushed) 

And remove this file :)
