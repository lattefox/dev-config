# 复制到仓库根目录使用；入口名与 Node 仓库的 pnpm 脚本一一对应（计划书 4.2）
.PHONY: format format-check lint type-check unused check test

format:
	uv run ruff format .
	uv run ruff check --fix .

format-check:
	uv run ruff format --check .

lint:
	uv run ruff check .

type-check:
	uv run mypy .

unused:
	uv run vulture
	uv run deptry .

check: format-check lint type-check

test:
	uv run pytest
