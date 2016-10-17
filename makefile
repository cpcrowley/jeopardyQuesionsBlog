# ~/a/jeopardyBlog
help: ; @cat ./makefile
.PHONY: hexo upload
GCS_BUCKET_DIR = gs://crowley.pw/jeopardy/
CACHE_CONTROL = -h "Cache-Control:private, max-age=0, no-transform"
hexo:
	hexo clean
	hexo generate
	hexo serve
upload:
	hexo clean
	hexo generate
	gsutil -m $(CACHE_CONTROL) rsync -e -r public/ $(GCS_BUCKET_DIR)
