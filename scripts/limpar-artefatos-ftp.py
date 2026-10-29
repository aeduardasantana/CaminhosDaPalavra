#!/usr/bin/env python3
"""Remove apenas arquivos rastreados pelo Git que não pertencem ao pacote público.

Arquivos remotos desconhecidos ou não rastreados nunca são removidos.
"""

import ftplib
import json
import os
import posixpath
import subprocess
import sys
from urllib.parse import urlparse

PUBLIC_EXTENSIONS = {
    ".html", ".css", ".js", ".json", ".svg", ".png", ".jpg", ".jpeg",
    ".webp", ".gif", ".ico", ".avif", ".woff", ".woff2", ".ttf", ".otf",
    ".webmanifest", ".xml",
}
EXCLUDED_PREFIXES = (
    ".github/", "scripts/", "tests/", "docs/", "RELATORIOS/", "data/", "dist/",
)
EXCLUDED_FILES = {"CNAME"}
REMOTE_PARTS = ("public_html", "caminhosdapalavra")


def is_public_web_file(file_path):
    if not file_path or file_path.startswith("/") or ".." in file_path.split("/"):
        return False
    if file_path.startswith(EXCLUDED_PREFIXES):
        return False
    if any(part.startswith(".") for part in file_path.split("/")):
        return False
    if file_path in EXCLUDED_FILES:
        return False
    return posixpath.splitext(file_path)[1].lower() in PUBLIC_EXTENSIONS


def tracked_files():
    result = subprocess.run(
        ["git", "ls-files", "-z"],
        check=True,
        stdout=subprocess.PIPE,
    )
    return sorted(path for path in result.stdout.decode("utf-8").split("\0") if path)


def cleanup_targets():
    return [path for path in tracked_files() if not is_public_web_file(path)]


def remote_cwd(ftp):
    ftp.cwd("/")
    for part in REMOTE_PARTS:
        ftp.cwd(part)


def remote_listing(ftp, relative_dir):
    remote_cwd(ftp)
    if relative_dir:
        for part in relative_dir.split("/"):
            ftp.cwd(part)
    names = ftp.nlst()
    return {posixpath.basename(name.rstrip("/")) for name in names}


def delete_known_file(ftp, file_path):
    parent, filename = posixpath.split(file_path)
    try:
        names = remote_listing(ftp, parent)
    except ftplib.error_perm as exc:
        if str(exc).startswith("550"):
            return False
        raise
    if filename not in names:
        return False

    remote_cwd(ftp)
    if parent:
        for part in parent.split("/"):
            ftp.cwd(part)
    ftp.delete(filename)
    print("Removido artefato interno rastreado:", file_path)
    return True


def prune_empty_directories(ftp, paths):
    candidates = set()
    for file_path in paths:
        parent = posixpath.dirname(file_path)
        while parent:
            candidates.add(parent)
            parent = posixpath.dirname(parent)

    for directory in sorted(candidates, key=lambda value: (value.count("/"), len(value)), reverse=True):
        parent, name = posixpath.split(directory)
        try:
            remote_cwd(ftp)
            if parent:
                for part in parent.split("/"):
                    ftp.cwd(part)
            ftp.rmd(name)
            print("Diretório interno vazio removido:", directory)
        except ftplib.error_perm:
            # A pasta não existe, contém arquivos desconhecidos ou não pode ser removida.
            # Nunca usar rm recursivo: arquivos não rastreados são preservados.
            continue


def connect_ftp():
    raw_host = os.environ.get("FTP_HOST", "").strip()
    username = os.environ.get("FTP_USER", "")
    password = os.environ.get("FTP_PASS", "")
    if not raw_host or not username or not password:
        raise RuntimeError("Credenciais FTP ausentes; a limpeza foi interrompida.")

    parsed = urlparse(raw_host if "://" in raw_host else "ftp://" + raw_host)
    if not parsed.hostname:
        raise RuntimeError("FTP_HOST não contém um host válido.")
    ftp = ftplib.FTP_TLS(timeout=30)
    ftp.connect(parsed.hostname, parsed.port or 21)
    ftp.login(username, password)
    ftp.prot_p()
    return ftp


def main():
    targets = cleanup_targets()
    if "--dry-run" in sys.argv:
        print(json.dumps({"count": len(targets), "paths": targets}, ensure_ascii=False))
        return

    ftp = connect_ftp()
    try:
        try:
            remote_cwd(ftp)
        except ftplib.error_perm as exc:
            if str(exc).startswith("550"):
                print("Pasta remota ainda não existe; limpeza seletiva ignorada.")
                return
            raise

        try:
            chunks = []
            ftp.retrbinary("RETR index.html", chunks.append)
        except ftplib.error_perm as exc:
            if str(exc).startswith("550"):
                print("index.html remoto ainda não existe; limpeza seletiva ignorada.")
                return
            raise

        index_html = b"".join(chunks).decode("utf-8", errors="replace")
        if "caminhos da palavra" not in index_html.lower():
            raise RuntimeError(
                "O index.html remoto não identifica Caminhos da Palavra. "
                "Nenhum arquivo foi removido; verifique o destino FTP."
            )

        removed = 0
        for file_path in sorted(targets, key=lambda value: (value.count("/"), len(value)), reverse=True):
            if delete_known_file(ftp, file_path):
                removed += 1
        prune_empty_directories(ftp, targets)
        print(
            "Limpeza seletiva concluída:",
            removed,
            "artefatos internos rastreados removidos;",
            "arquivos desconhecidos e não rastreados preservados."
        )
    finally:
        try:
            ftp.quit()
        except Exception:
            ftp.close()


if __name__ == "__main__":
    main()
