

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('downloadBtn').addEventListener('click', mp3);

    async function mp3() {
        const url = document.getElementById('url').value;
        const texto = document.getElementById('texto');

        if (!url) {
            texto.innerHTML = "Por favor, insira uma URL válida.";
            return;
        }

        texto.innerHTML = "Iniciando o download...";

        try {
            // Faz a requisição à API
            const response = await fetch(`https://converter-mp3-iota.vercel.app/download?url=${encodeURIComponent(url)}`);

            if (!response.ok) {
                throw new Error("Erro ao baixar o arquivo. Verifique a URL ou o servidor.");
            }
            const blob = await response.blob();
            
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;

            // Define o nome do arquivo com base no header Content-Disposition, se disponível
            const contentDisposition = response.headers.get('Content-Disposition');
            let fileName = 'audio.mp3';
            if (contentDisposition) {
                const matches = contentDisposition.match(/filename="(.+)"/);
                if (matches && matches[1]) fileName = matches[1];
            }
            a.download = fileName;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(downloadUrl);

            texto.innerHTML = "Download concluído!";
        } catch (error) {
            console.error("Erro:", error);
            texto.innerHTML = "Erro: " + error.message;
        }
    }
});