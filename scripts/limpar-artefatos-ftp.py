#!/usr/bin/env python3
"""P1: remover somente os dois JSONs bíblicos da raiz publicada na Locaweb.

Nenhum outro arquivo ou diretório remoto é removido.
Os arquivos de origem no repositório GitHub não são alterados.
"""
import ftplib
import json
import os
import posixpath
import sys
from urllib.parse import urlparse

TARGETS = ("bibliaAveMaria.json", "bibliaAveMariaRAW.json")
REMOTE_PARTS = ("public_html", "caminhosdapalavra")


def remote_cwd(ftp):
    ftp.cwd("/")
    for part in REMOTE_PARTS:
        ftp.cwd(part)


def remote_files(ftp):
    remote_cwd(ftp)
    return {posixpath.basename(name.rstrip("/")) for name in ftp.nlst()}


def confirm_target(ftp):
    remote_cwd(ftp)
    chunks = []
    ftp.retrbinary("RETR index.html", chunks.append)
    index_html = b"".join(chunks).decode("utf-8", errors="replace")
    if "caminhos da palavra" not in index_html.lower():
        raise RuntimeError(
            "O index.html remoto não identifica Caminhos da Palavra; "
            "nenhuma exclusão foi realizada."
        )


def connect_ftp():
    raw_host = os.environ.get("FTP_HOST", "").strip()
    username = os.environ.get("FTP_USER", "")
    password = os.environ.get("FTP_PASS", "")
    if not raw_host or not username or not password:
        raise RuntimeError("Credenciais FTP ausentes; operação interrompida.")

    parsed = urlparse(raw_host if "://" in raw_host else "ftp://" + raw_host)
    if not parsed.hostname:
        raise RuntimeError("FTP_HOST não contém um host válido.")
    # Emprega o mesmo FTP comum já utilizado pelo deploy homologado da Locaweb.
    ftp = ftplib.FTP(timeout=30)
    ftp.connect(parsed.hostname, parsed.port or 21)
    ftp.login(username, password)
    return ftp


def main():
    if "--dry-run" in sys.argv:
        print(json.dumps({"count": len(TARGETS), "paths": list(TARGETS)}, ensure_ascii=False))
        return

    verify_only = "--verify-only" in sys.argv
    ftp = connect_ftp()
    try:
        confirm_target(ftp)
        before = remote_files(ftp)
        print("Antes da operação:", {
            file: ("presente" if file in before else "ausente") for file in TARGETS
        })

        if not verify_only:
            for filename in TARGETS:
                if filename not in before:
                    print("Já ausente da raiz FTP:", filename)
                    continue
                remote_cwd(ftp)
                ftp.delete(filename)
                print("Removido exclusivamente da raiz FTP:", filename)

        after = remote_files(ftp)
        remaining = [file for file in TARGETS if file in after]
        if remaining:
            raise RuntimeError(
                "A verificação FTP encontrou JSONs ainda na raiz: " + ", ".join(remaining)
            )
        print(
            "Verificação FTP aprovada: bibliaAveMaria.json e bibliaAveMariaRAW.json "
            "ausentes de /public_html/caminhosdapalavra/."
        )
    finally:
        try:
            ftp.quit()
        except Exception:
            ftp.close()


if __name__ == "__main__":
    main()
