
(function(){
  const CARD_W = 680, CARD_H = 400;
  const DPR = Math.min((window.devicePixelRatio || 1) * 1.5, 3);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stage = document.getElementById('stage');
  const cardScene = document.getElementById('cardScene');
  const card = document.getElementById('card');
  const frontCanvas = document.getElementById('frontCanvas');
  const backCanvas = document.getElementById('backCanvas');
  const toolbar = document.getElementById('toolbar');
  const btnFlip = document.getElementById('btnFlip');
  const btnClose = document.getElementById('btnClose');
  const btnPaint = document.getElementById('btnPaint');
  const btnBurn = document.getElementById('btnBurn');
  const btnShred = document.getElementById('btnShred');
  const btnReset = document.getElementById('btnReset');

  [frontCanvas, backCanvas].forEach(c=>{
    c.width = CARD_W*DPR; c.height = CARD_H*DPR;
  });
  const fctx = frontCanvas.getContext('2d');
  const bctx = backCanvas.getContext('2d');
  fctx.scale(DPR,DPR);
  bctx.scale(DPR,DPR);

  function getCss(name){
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  // ---------- paper texture: a real photographed cardstock, cleaned up toward white ----------
  const TEX_SCALE = 2;
  const texCanvas = document.createElement('canvas');
  texCanvas.width = CARD_W*TEX_SCALE; texCanvas.height = CARD_H*TEX_SCALE;
  const inkGrain = document.createElement('canvas');
  inkGrain.width = CARD_W; inkGrain.height = CARD_H;
  const textureReady = new Promise((resolve)=>{
    const tx = texCanvas.getContext('2d');
    const img = new Image();
    img.onload = ()=>{
      tx.drawImage(img, 0,0, CARD_W*TEX_SCALE, CARD_H*TEX_SCALE);

      // faint edge falloff, barely perceptible
      const TW = CARD_W*TEX_SCALE, TH = CARD_H*TEX_SCALE;
      const vg = tx.createRadialGradient(TW/2,TH/2,TH*0.4,TW/2,TH/2,TW*0.75);
      vg.addColorStop(0,'rgba(0,0,0,0)');
      vg.addColorStop(1,'rgba(10,10,10,0.06)');
      tx.fillStyle = vg;
      tx.fillRect(0,0,TW,TH);

      // ink-grain: the same paper fiber, blurred down to soft blotches (fine
      // per-pixel grain is invisible inside a 2-4px letter stroke — it needs
      // to be coarse to read at all), with contrast punched back in, then
      // converted into a dark-only alpha mask (blotch -> extra ink density).
      // Composited with 'source-atop' this only ever deepens the ink
      // locally, never lightens it, so it reads as unevenly absorbed print
      // rather than a flat digital fill or a washed-out overlay.
      const coarse = document.createElement('canvas');
      coarse.width = Math.max(1, Math.round(CARD_W/16));
      coarse.height = Math.max(1, Math.round(CARD_H/16));
      coarse.getContext('2d').drawImage(texCanvas, 0,0, coarse.width, coarse.height);

      const gctx = inkGrain.getContext('2d');
      gctx.filter = 'contrast(6) brightness(0.9)';
      gctx.drawImage(coarse, 0,0, CARD_W, CARD_H);
      gctx.filter = 'none';
      const gid = gctx.getImageData(0,0,CARD_W,CARD_H);
      const gd = gid.data;
      let lo=255, hi=0;
      for(let i=0;i<gd.length;i+=4){ const l=(gd[i]+gd[i+1]+gd[i+2])/3; if(l<lo)lo=l; if(l>hi)hi=l; }
      const mid = (lo+hi)/2;
      for(let i=0;i<gd.length;i+=4){
        const lum = (gd[i]+gd[i+1]+gd[i+2])/3;
        const t = Math.min(1, Math.max(0, (mid-lum)/((mid-lo)||1)));
        gd[i]=20; gd[i+1]=16; gd[i+2]=12;
        gd[i+3] = Math.round(t*255);
      }
      gctx.putImageData(gid,0,0);

      resolve();
    };
    img.onerror = ()=>{
      tx.fillStyle = getCss('--paper');
      tx.fillRect(0,0,CARD_W*TEX_SCALE,CARD_H*TEX_SCALE);
      resolve();
    };
    img.src = "/card-texture.webp";
  });

  // ---------- January Capital wordmark (their real brand SVG, from january.capital) ----------
  let jcLogo = null;
  const logoReady = new Promise((resolve)=>{
    const img = new Image();
    img.onload = ()=>{ jcLogo = img; resolve(); };
    img.onerror = ()=> resolve();
    img.src = 'data:image/svg+xml;base64,PHN2ZyBpZD0iR3JvdXBfMTM0ODYiIGRhdGEtbmFtZT0iR3JvdXAgMTM0ODYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyNDIuMyIgaGVpZ2h0PSI4OC4zMDgiIHZpZXdCb3g9IjAgMCAyNDIuMyA4OC4zMDgiPg0KICA8ZGVmcz4NCiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+DQogICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlXzE1MDY2IiBkYXRhLW5hbWU9IlJlY3RhbmdsZSAxNTA2NiIgd2lkdGg9IjI0Mi4zIiBoZWlnaHQ9Ijg4LjMwOCIgZmlsbD0ibm9uZSIvPg0KICAgIDwvY2xpcFBhdGg+DQogIDwvZGVmcz4NCiAgPGcgaWQ9Ikdyb3VwXzEzNDg1IiBkYXRhLW5hbWU9Ikdyb3VwIDEzNDg1IiBjbGlwLXBhdGg9InVybCgjY2xpcC1wYXRoKSI+DQogICAgPHBhdGggaWQ9IlBhdGhfMTQwODAiIGRhdGEtbmFtZT0iUGF0aCAxNDA4MCIgZD0iTTQwLjAxNCwxNC43NzhjLTQuMTMzLDAtNS42NTcsMS4yNzgtNS45LDQuNTI1SDI5LjA5M2MuMjQ2LTQuODIxLDMuMzQ1LTguNjA5LDEwLjkyMS04LjYwOSw1LjU2LDAsOS42OTIsMi4xMTUsOS42OTIsOC44MDdWMzEuNDU1YzAsMS43NzEuMzkzLDIuNzA2LDIuNDExLDIuNTF2Mi40NTlhNy43ODYsNy43ODYsMCwwLDEtMywuNTQxYy0yLjc1NCwwLTQuMDM0LS45ODMtNC41MjUtMy40NDRoLS4xYy0xLjU3NCwyLjIxNS00LjQyNywzLjc0LTguMzE1LDMuNzQtNS4xMTYsMC04LjI2NS0yLjk1Mi04LjI2NS03LjE4NCwwLTUuNTEsNC4wODMtNy4yMzEsMTAuMzgtOC40NjIsMy44ODYtLjczOCw2LjI0OC0xLjIzLDYuMjQ4LTMuNjQyLDAtMS44MTktMS4wODItMy4yLTQuNTI2LTMuMm00LjUyNiwxMi4yVjIzLjE5YTE3LjI2MywxNy4yNjMsMCwwLDEtNS4yNjMsMS42NzJjLTQuMjgxLjkzNS02LjE1LDIuMTY1LTYuMTUsNC43MjMsMCwyLjMxMiwxLjM3OCwzLjU5Myw0LjE4MSwzLjU5Myw0LjI4MSwwLDcuMjMzLTIuMTE3LDcuMjMzLTYuMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTMuNTEzIC0xLjM0NikiIGZpbGw9IiMxNzE4MjkiLz4NCiAgICA8cGF0aCBpZD0iUGF0aF8xNDA4MSIgZGF0YS1uYW1lPSJQYXRoIDE0MDgxIiBkPSJNODEuMDA1LDE5LjE1NVYzNi41MjNINzUuNzlWMjAuNjMxYzAtMy40LTEuNDI3LTUuNTU5LTQuOTY5LTUuNTU5LTMuOTg1LDAtNi41NDMsMi40MS02LjU0Myw2LjE0OXYxNS4zSDU5LjExM1YxMS4zODNoNS4xNjZ2My4yNDdoLjFjMS4zMjktMS45NjgsMy45MzUtMy45MzYsOC4yNjUtMy45MzYsNC42NzUsMCw4LjM2NCwyLjcwNiw4LjM2NCw4LjQ2MiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTcuNDQxIC0xLjM0NikiIGZpbGw9IiMxNzE4MjkiLz4NCiAgICA8cGF0aCBpZD0iUGF0aF8xNDA4MiIgZGF0YS1uYW1lPSJQYXRoIDE0MDgyIiBkPSJNMTEwLjE2NywxMS40ODJ2MjUuMTRIMTA1VjMzLjM3NGgtLjFjLTEuMzI5LDEuOTY5LTMuOTM2LDMuOTM1LTguMjY2LDMuOTM1LTQuNjczLDAtOC4zNjMtMi43MDYtOC4zNjMtOC40NjJWMTEuNDgyaDUuMjE0djE1Ljg5YzAsMy40LDEuNDI3LDUuNTYsNC45NjksNS41NiwzLjk4NSwwLDYuNTQzLTIuNDEyLDYuNTQzLTYuMTV2LTE1LjNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTEuMTEyIC0xLjQ0NSkiIGZpbGw9IiMxNzE4MjkiLz4NCiAgICA8cGF0aCBpZD0iUGF0aF8xNDA4MyIgZGF0YS1uYW1lPSJQYXRoIDE0MDgzIiBkPSJNMTI4Ljg1LDE0Ljc3OGMtNC4xMzMsMC01LjY1NywxLjI3OC01LjksNC41MjVoLTUuMDE4Yy4yNDYtNC44MjEsMy4zNDUtOC42MDksMTAuOTIxLTguNjA5LDUuNTYsMCw5LjY5MiwyLjExNSw5LjY5Miw4LjgwN1YzMS40NTVjMCwxLjc3MS4zOTMsMi43MDYsMi40MTEsMi41MXYyLjQ1OWE3Ljc4Niw3Ljc4NiwwLDAsMS0zLC41NDFjLTIuNzU0LDAtNC4wMzQtLjk4My00LjUyNS0zLjQ0NGgtLjFjLTEuNTc0LDIuMjE1LTQuNDI3LDMuNzQtOC4zMTUsMy43NC01LjExNiwwLTguMjY1LTIuOTUyLTguMjY1LTcuMTg0LDAtNS41MSw0LjA4My03LjIzMSwxMC4zOC04LjQ2MiwzLjg4Ni0uNzM4LDYuMjQ4LTEuMjMsNi4yNDgtMy42NDIsMC0xLjgxOS0xLjA4Mi0zLjItNC41MjYtMy4ybTQuNTI2LDEyLjJWMjMuMTlhMTcuMjYzLDE3LjI2MywwLDAsMS01LjI2MywxLjY3MmMtNC4yODEuOTM1LTYuMTUsMi4xNjUtNi4xNSw0LjcyMywwLDIuMzEyLDEuMzc4LDMuNTkzLDQuMTgxLDMuNTkzLDQuMjgxLDAsNy4yMzMtMi4xMTcsNy4yMzMtNi4yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTQuNjk2IC0xLjM0NikiIGZpbGw9IiMxNzE4MjkiLz4NCiAgICA8cGF0aCBpZD0iUGF0aF8xNDA4NCIgZGF0YS1uYW1lPSJQYXRoIDE0MDg0IiBkPSJNMTYyLjEsMTAuOTUzdjQuODcySDE2MmMtNC45NjktLjgzNy04Ljk1NSwyLjUwOS04Ljk1NSw3Ljg3MXYxMi44NGgtNS4xNjZWMTEuNGg1LjE2NlYxNi4xMmguMWMxLjMyOS0zLjE0OSwzLjQtNS4zMTQsNi42OTEtNS4zMTRhMTUuOTc3LDE1Ljk3NywwLDAsMSwyLjI2My4xNDciIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xOC42MTUgLTEuMzYpIiBmaWxsPSIjMTcxODI5Ii8+DQogICAgPHBhdGggaWQ9IlBhdGhfMTQwODUiIGRhdGEtbmFtZT0iUGF0aCAxNDA4NSIgZD0iTTE2LjM4Myw1NS4xNjRjLTcuNTc2LDAtMTAuNTc3LDYuMzQ1LTEwLjU3NywxMy4yODMsMCw2Ljk4NSwzLDEzLjMzMiwxMC41NzcsMTMuMzMyLDYuNTQ0LDAsOS4wNTItNC4yODEsOS40NDYtOC41Nmg1Ljg1NUMzMC45LDgxLjE0MSwyNS40ODQsODYuOCwxNi41MzEsODYuOCw2LjQsODYuOCwwLDc5LjA3MywwLDY4LjQ0OGMwLTEwLjU3OSw2LjQtMTguMywxNi41MzEtMTguMyw4LjksMCwxNC4zMTYsNS42NTcsMTUuMTUzLDEyLjg0MUgyNS44MjljLS42MzktMy41NDQtMi45NTEtNy44MjMtOS40NDYtNy44MjMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTYuMzEyKSIgZmlsbD0iIzE3MTgyOSIvPg0KICAgIDxwYXRoIGlkPSJQYXRoXzE0MDg2IiBkYXRhLW5hbWU9IlBhdGggMTQwODYiIGQ9Ik01MC43NzIsNjUuNzY3Yy00LjEzMywwLTUuNjU3LDEuMjc5LTUuOSw0LjUyNUgzOS44NTFjLjI0Ni00LjgyMSwzLjM0NS04LjYwOSwxMC45MjEtOC42MDksNS41NTksMCw5LjY5MiwyLjExNSw5LjY5Miw4LjgwN1Y4Mi40NDRjMCwxLjc3MS4zOTMsMi43MDYsMi40MTEsMi41MXYyLjQ1OWE3Ljc4NCw3Ljc4NCwwLDAsMS0zLC41NDFjLTIuNzU2LDAtNC4wMzUtLjk4My00LjUyNi0zLjQ0NGgtLjFjLTEuNTc0LDIuMjE1LTQuNDI4LDMuNzQtOC4zMTUsMy43NC01LjExNiwwLTguMjY1LTIuOTUyLTguMjY1LTcuMTg0LDAtNS41MSw0LjA4My03LjIzMSwxMC4zOC04LjQ2MSwzLjg4Ni0uNzM5LDYuMjQ4LTEuMjMxLDYuMjQ4LTMuNjQyLDAtMS44Mi0xLjA4Mi0zLjItNC41MjYtMy4ybTQuNTI2LDEyLjJWNzQuMTc5YTE3LjI2MSwxNy4yNjEsMCwwLDEtNS4yNjQsMS42NzJjLTQuMjgxLjkzNS02LjE0OSwyLjE2NS02LjE0OSw0LjcyMywwLDIuMzEyLDEuMzc4LDMuNTkzLDQuMTgyLDMuNTkzLDQuMjgsMCw3LjIzMi0yLjExNiw3LjIzMi02LjIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00Ljg2OCAtNy43NjQpIiBmaWxsPSIjMTcxODI5Ii8+DQogICAgPHBhdGggaWQ9IlBhdGhfMTQwODciIGRhdGEtbmFtZT0iUGF0aCAxNDA4NyIgZD0iTTk0LDc0Ljk2N2MwLDguMjY1LTQuNzczLDEzLjI4My0xMS4xNjgsMTMuMjgzYTkuMSw5LjEsMCwwLDEtNy43MjUtMy43NGgtLjFWOTYuMDcySDY5Ljh2LTMzLjdINzUuMDF2Mi45NTFoLjFhOS4zMDgsOS4zMDgsMCwwLDEsNy43MjUtMy42NDFDODkuMjI5LDYxLjY4Myw5NCw2Ni43LDk0LDc0Ljk2N20tNS4yMTUsMGMwLTQuOTItMi40MTEtOS4wNTMtNi45MzctOS4wNTMtNC4xODIsMC02Ljc4OSwzLjQ0NC02Ljc4OSw5LjA1MywwLDUuNTU5LDIuNjA4LDkuMDUyLDYuNzg5LDkuMDUyLDQuNTI2LDAsNi45MzctNC4xMzIsNi45MzctOS4wNTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04Ljc4NiAtNy43NjQpIiBmaWxsPSIjMTcxODI5Ii8+DQogICAgPHBhdGggaWQ9IlBhdGhfMTQwODgiIGRhdGEtbmFtZT0iUGF0aCAxNDA4OCIgZD0iTTEwMS4yLDU0LjA4OWEyLjkzMywyLjkzMywwLDEsMSwyLjksMi43NTUsMi43NzksMi43NzksMCwwLDEtMi45LTIuNzU1bTUuNTEsMzIuMTI3aC01LjE2NVY2MS4wNzZoNS4xNjVaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTIuNzM5IC02LjQ2OCkiIGZpbGw9IiMxNzE4MjkiLz4NCiAgICA8cGF0aCBpZD0iUGF0aF8xNDA4OSIgZGF0YS1uYW1lPSJQYXRoIDE0MDg5IiBkPSJNMTIwLjAyMyw2NS41NjFWNzkuMTkxYzAsMi44NTMsMS4zNzcsMy4yLDQuNzIzLDN2NC4yMzFhMTQuOTUyLDE0Ljk1MiwwLDAsMS0zLjU0Mi4zOTNjLTQuMTMzLDAtNi40LTEuODY4LTYuNC03LjE4MlY2NS41NjFoLTMuNjQxdi00LjIzaDMuNjQxVjUzLjQxaDUuMjE1djcuOTIxaDQuNzIzdjQuMjNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTMuOTkzIC02LjcyMykiIGZpbGw9IiMxNzE4MjkiLz4NCiAgICA8cGF0aCBpZD0iUGF0aF8xNDA5MCIgZGF0YS1uYW1lPSJQYXRoIDE0MDkwIiBkPSJNMTQxLjYxOCw2NS43NjdjLTQuMTM0LDAtNS42NTcsMS4yNzktNS45LDQuNTI1SDEzMC43Yy4yNDUtNC44MjEsMy4zNDQtOC42MDksMTAuOTIxLTguNjA5LDUuNTU5LDAsOS42OTIsMi4xMTUsOS42OTIsOC44MDdWODIuNDQ0YzAsMS43NzEuMzkyLDIuNzA2LDIuNDEsMi41MXYyLjQ1OWE3Ljc4Niw3Ljc4NiwwLDAsMS0zLC41NDFjLTIuNzU0LDAtNC4wMzMtLjk4My00LjUyNC0zLjQ0NGgtLjFjLTEuNTczLDIuMjE1LTQuNDI3LDMuNzQtOC4zMTQsMy43NC01LjExNywwLTguMjY1LTIuOTUyLTguMjY1LTcuMTg0LDAtNS41MSw0LjA4Mi03LjIzMSwxMC4zOC04LjQ2MSwzLjg4Ni0uNzM5LDYuMjQ3LTEuMjMxLDYuMjQ3LTMuNjQyLDAtMS44Mi0xLjA4Mi0zLjItNC41MjUtMy4ybTQuNTI1LDEyLjJWNzQuMTc5YTE3LjI0NiwxNy4yNDYsMCwwLDEtNS4yNjIsMS42NzJjLTQuMjgyLjkzNS02LjE1MSwyLjE2NS02LjE1MSw0LjcyMywwLDIuMzEyLDEuMzc4LDMuNTkzLDQuMTgxLDMuNTkzLDQuMjgxLDAsNy4yMzItMi4xMTYsNy4yMzItNi4yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTYuMzAzIC03Ljc2NCkiIGZpbGw9IiMxNzE4MjkiLz4NCiAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlXzE1MDYxIiBkYXRhLW5hbWU9IlJlY3RhbmdsZSAxNTA2MSIgd2lkdGg9IjUuMjE2IiBoZWlnaHQ9IjM1LjE3NyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTQwLjUxOCA0NC41NzIpIiBmaWxsPSIjMTcxODI5Ii8+DQogICAgPHBhdGggaWQ9IlBhdGhfMTQwOTEiIGRhdGEtbmFtZT0iUGF0aCAxNDA5MSIgZD0iTTE1LjYwOSwwVjI0LjE1NmMwLDMuOTM1LS43ODgsNi43NC01LjE2Niw2Ljc0LTIuOTMsMC00LjIxOC0xLjIzMy00Ljc1Ny0zLjJMLjU0MiwyOS40NThjMS4yNDYsMy43MDUsNC4xNzYsNi40NTYsMTAuMDQ5LDYuNDU2LDguNDYyLDAsMTAuODIzLTUuNzA3LDEwLjgyMy0xMS43NThWMFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjA2OCkiIGZpbGw9IiMxNzE4MjkiLz4NCiAgICA8cGF0aCBpZD0iUGF0aF8xNDA5MiIgZGF0YS1uYW1lPSJQYXRoIDE0MDkyIiBkPSJNMTg1Ljc0LDExLjQ4MmwtNi42MjYsMTkuMjM1aC0uMUwxNzEuOTgsMTEuNDgyaC01LjU1OWw5LjEsMjIuNTgyYTUuMzI3LDUuMzI3LDAsMCwxLS42OSw1LjQ2MSwzLjUwOSwzLjUwOSwwLDAsMS0yLjExMSwxLjI0N3Y0LjM5MmMuMTQ4LjAwNS4yODYuMDE3LjQzOS4wMTcsNC44MjEsMCw2LjQ0NC0zLjEsNy44NzEtNi45ODVsMTAuMjE4LTI2LjcxNFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMC45NDggLTEuNDQ1KSIgZmlsbD0iIzE3MTgyOSIvPg0KICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfMTUwNjIiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDE1MDYyIiB3aWR0aD0iMjguMjI0IiBoZWlnaHQ9IjUuMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcyLjMzIDQyLjEwNykiIGZpbGw9IiMwMDNkYTYiLz4NCiAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlXzE1MDYzIiBkYXRhLW5hbWU9IlJlY3RhbmdsZSAxNTA2MyIgd2lkdGg9IjUuMiIgaGVpZ2h0PSIyOC4wODciIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwNC45MTUgNTEuNjYxKSIgZmlsbD0iIzAwM2RhNiIvPg0KICAgIDxyZWN0IGlkPSJSZWN0YW5nbGVfMTUwNjQiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDE1MDY0IiB3aWR0aD0iMjguMjI1IiBoZWlnaHQ9IjUuMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjE0LjA3NiA0Mi4xMDcpIiBmaWxsPSIjMDAzZGE2Ii8+DQogICAgPHJlY3QgaWQ9IlJlY3RhbmdsZV8xNTA2NSIgZGF0YS1uYW1lPSJSZWN0YW5nbGUgMTUwNjUiIHdpZHRoPSI1LjIiIGhlaWdodD0iMjguMDg3IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMDQuOTE1IDEwLjAzNCkiIGZpbGw9IiMwMDNkYTYiLz4NCiAgICA8cGF0aCBpZD0iUGF0aF8xNDA5MyIgZGF0YS1uYW1lPSJQYXRoIDE0MDkzIiBkPSJNMjcxLjE3NSwxNi44MDUsMjY3LjUsMTMuMTI4LDI0NS4zMzcsMzYuMTY0bDMuNjc3LDMuNjc3WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTMwLjg4MiAtMS42NTIpIiBmaWxsPSIjMDAzZGE2Ii8+DQogICAgPHBhdGggaWQ9IlBhdGhfMTQwOTQiIGRhdGEtbmFtZT0iUGF0aCAxNDA5NCIgZD0iTTIyNS4yOCw2Mi43LDIyMS42LDU5LjAyMywxOTkuNDQyLDgyLjA1OWwzLjY3NywzLjY3N1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNS4xMDUgLTcuNDMpIiBmaWxsPSIjMDAzZGE2Ii8+DQogIDwvZz4NCjwvc3ZnPg0K';
  });

  function drawLogo(ctx, rightX, centerY, targetH){
    if(!jcLogo) return false;
    const w = targetH * (jcLogo.naturalWidth / jcLogo.naturalHeight);
    const x0 = rightX-w, y0 = centerY-targetH/2;
    ctx.save();
    ctx.filter = 'grayscale(1) contrast(1.1) brightness(0.95)';
    ctx.drawImage(jcLogo, x0, y0, w, targetH);
    ctx.restore();
    return true;
  }

  // Faint, fixed-position scan artifacts — a couple of soft smudges and a
  // few dust specks, like a real card photographed rather than a flat
  // vector render. Positions are constants (not random) so the "scan"
  // looks the same every time, the way a real artifact would.
  function drawScanArtifacts(ctx, smudges, dust){
    ctx.save();
    smudges.forEach(([sx,sy,rx,ry,alpha])=>{
      ctx.save();
      ctx.translate(sx,sy);
      ctx.scale(rx,ry);
      const g = ctx.createRadialGradient(0,0,0,0,0,1);
      g.addColorStop(0, `rgba(60,50,40,${alpha})`);
      g.addColorStop(1, 'rgba(60,50,40,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0,0,1,0,Math.PI*2);
      ctx.fill();
      ctx.restore();
    });
    dust.forEach(([dx,dy,r,alpha])=>{
      ctx.beginPath();
      ctx.fillStyle = `rgba(40,34,28,${alpha})`;
      ctx.arc(dx,dy,r,0,Math.PI*2);
      ctx.fill();
    });
    ctx.restore();
  }

  const GARAMOND = "'Garamond Classico SC', 'EB Garamond', serif";

  // Garamond Classico SC is a genuine small-caps cut: typed lowercase letters
  // (an, oreno, roduct…) render as small caps automatically, typed capitals
  // (proper nouns, sentence starts) render as full caps — no manual case or
  // size juggling needed, just draw the text as written.
  // Single native fillText call (not a per-character loop) so the browser's
  // own shaping handles the small-caps glyph substitution and letter-spacing
  // together consistently — measuring/advancing character-by-character with
  // measureText() doesn't account for the substituted glyph widths and
  // produced uneven gaps (e.g. around "heyabc.xyz"'s period).
  function drawSpaced(ctx, text, x, y, {align='left', spacing=0} = {}){
    ctx.letterSpacing = spacing + 'px';
    ctx.textAlign = align;
    const total = ctx.measureText(text).width;
    ctx.fillText(text, x, y);
    ctx.letterSpacing = '0px';
    ctx.textAlign = 'left';
    return total;
  }

  // Printed ink, textured rather than a flat digital fill: the glyphs are
  // rendered to a transparent offscreen layer, then the paper's own grain
  // (contrast-boosted) is stamped through that same alpha mask via
  // 'source-atop' — so the ink is mottled by the fiber it sat on, the way
  // real print looks uneven on textured stock, instead of a perfectly flat
  // vector fill.
  // Renders onto a transparent offscreen layer via `painter`, stamps the
  // paper's grain through whatever alpha that leaves behind via
  // 'source-atop', then composites the result onto the real canvas.
  function stampInk(ctx, painter){
    const off = document.createElement('canvas');
    off.width = ctx.canvas.width; off.height = ctx.canvas.height;
    const octx = off.getContext('2d');
    octx.scale(DPR, DPR);
    painter(octx);

    octx.globalCompositeOperation = 'source-atop';
    octx.globalAlpha = 0.85;
    octx.drawImage(inkGrain, 0, 0, CARD_W, CARD_H);
    octx.globalAlpha = 1;
    octx.globalCompositeOperation = 'source-over';

    ctx.drawImage(off, 0, 0, CARD_W, CARD_H);
  }

  function drawEmbossed(ctx, text, x, y, {align='left', spacing=0, size, weight='400', italic=false, family=GARAMOND, color} = {}){
    const ink = color || getCss('--ink');
    stampInk(ctx, (octx)=>{
      octx.font = `${italic?'italic ':''}${weight} ${size}px ${family}`;
      octx.fontVariantCaps = 'small-caps';
      octx.fillStyle = ink;
      drawSpaced(octx, text, x, y, {align, spacing});
    });
  }

  // The period glyph's own side-bearing is unpredictable across sizes/weights
  // and kept reading as a stray gap no matter how it was nudged. Skip the
  // glyph entirely and draw the dot as a plain filled circle with a fixed,
  // deliberate gap on each side — fully controlled, not at the mercy of the
  // font's metrics.
  function drawUrl(ctx, text, x, y, {align='left', size, weight='400', family=GARAMOND, color} = {}){
    const ink = color || getCss('--ink');
    const [a, b] = text.split('.');
    const gap = size*0.06;
    const dotR = size*0.045;
    stampInk(ctx, (octx)=>{
      octx.font = `${weight} ${size}px ${family}`;
      octx.fontVariantCaps = 'small-caps';
      octx.fillStyle = ink;
      octx.textAlign = 'left';
      const wa = octx.measureText(a).width;
      const wb = octx.measureText(b).width;
      const total = wa + gap + dotR*2 + gap + wb;
      const startX = align==='left' ? x : align==='right' ? x-total : x-total/2;
      octx.fillText(a, startX, y);
      const dotCx = startX + wa + gap + dotR;
      octx.beginPath();
      octx.arc(dotCx, y-dotR, dotR, 0, Math.PI*2);
      octx.fill();
      octx.fillText(b, dotCx + dotR + gap, y);
    });
  }

  // Patrick Bateman treatment: first name set smaller in normal case, surname
  // set larger in full caps, both sharing one baseline — the same size
  // contrast visible on the reference card, rather than uniform small-caps.
  function drawName(ctx, first, last, centerX, y, {size1, size2, weight='400', family=GARAMOND, gap=10, color} = {}){
    const ink = color || getCss('--ink');
    stampInk(ctx, (octx)=>{
      octx.textAlign = 'left';
      octx.fillStyle = ink;
      octx.font = `${weight} ${size1}px ${family}`;
      const w1 = octx.measureText(first).width;
      octx.font = `${weight} ${size2}px ${family}`;
      const w2 = octx.measureText(last).width;
      const startX = centerX - (w1+gap+w2)/2;
      octx.font = `${weight} ${size1}px ${family}`;
      octx.fillText(first, startX, y);
      octx.font = `${weight} ${size2}px ${family}`;
      octx.fillText(last, startX+w1+gap, y);
    });
  }

  const FRONT_SMUDGES = [ [120,340,70,18,0.05], [565,135,42,26,0.035] ];
  const FRONT_DUST = [ [95,210,1.2,0.22], [430,95,1,0.18], [610,300,1.3,0.2], [250,370,0.9,0.15] ];

  function drawFront(){
    fctx.clearRect(0,0,CARD_W,CARD_H);
    fctx.drawImage(texCanvas,0,0,CARD_W,CARD_H);
    fctx.textAlign = 'left';

    drawUrl(fctx, 'heyabc.xyz', 40, 58, {size:24, weight:'700'});
    if(!drawLogo(fctx, CARD_W-40, 52, 52)){
      drawEmbossed(fctx, 'January Capital', CARD_W-40, 55, {align:'right', size:18, spacing:0.5});
    }

    drawEmbossed(fctx, 'Arun BABURAJ', CARD_W/2, CARD_H/2-2, {align:'center', size:46});

    drawEmbossed(fctx, 'Product Manager', CARD_W/2, CARD_H/2+38, {align:'center', size:29, spacing:0.3});

    fctx.globalAlpha = 0.75;
    drawEmbossed(fctx, 'Building Data Products to Spot Founders First', CARD_W/2, CARD_H-38, {align:'center', size:21, spacing:0.3});
    fctx.globalAlpha = 1;

    drawScanArtifacts(fctx, FRONT_SMUDGES, FRONT_DUST);
  }

  function drawBack(){
    bctx.clearRect(0,0,CARD_W,CARD_H);
    bctx.drawImage(texCanvas,0,0,CARD_W,CARD_H);
    const cx = CARD_W/2, cy = CARD_H/2+8;

    drawEmbossed(bctx, "Without A Goal, You Can't Score", cx, cy, {align:'center', size:28, spacing:0.3});

    drawScanArtifacts(bctx, [[540,300,55,20,0.045],[110,110,35,22,0.03]], [[590,80,1.1,0.2],[80,340,1.3,0.18],[350,60,0.9,0.15]]);
  }

  Promise.all([
    textureReady,
    logoReady,
    document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()
  ]).then(()=>{ drawFront(); drawBack(); });

  // ---------- open / close (tucked card at the screen edge) ----------
  let isOpen = false;

  // Opening and closing are mutually exclusive, and a class left behind by a
  // missed animationend (e.g. the tab was hidden, which freezes animations)
  // would stop the next run from restarting. Clearing both and forcing a
  // reflow before re-adding makes the animation restart unconditionally.
  let animClearTimer;
  function restartAnim(name){
    clearTimeout(animClearTimer);
    card.classList.remove('opening','closing');
    void card.offsetWidth;
    card.classList.add(name);
    const done = ()=> card.classList.remove(name);
    card.addEventListener('animationend', done, {once:true});
    animClearTimer = setTimeout(done, 1300); // belt-and-braces
  }

  function openCard(){
    if(isOpen) return;
    isOpen = true;
    if(window.askMotionPermission) window.askMotionPermission();
    // Slower, deliberate motion for this one reveal — swapped back to the
    // snappy hover-tilt duration once it settles (see the timeout below).
    // Matches the 1.1s spin duration so both finish together as one motion.
    cardScene.style.transition = 'transform 1.1s cubic-bezier(0.45,0,0.15,1)';
    stage.classList.remove('closed');
    stage.classList.add('is-open');
    restartAnim('opening');
    tiltFrozen = true;           // the reveal owns the transform until it lands
    setTimeout(()=>{
      cardScene.style.transition = '';
      sceneRect = null;          // the card just moved; the cached box is stale
      tiltFrozen = false;
    }, 1150);
  }
  cardScene.addEventListener('click', openCard);

  function closeCard(){
    if(!isOpen) return;
    document.querySelectorAll('.strip').forEach(el=> el.remove());
    shredded = false;
    clearTimeout(restoreTimer);
    if(flipped) setFlipped(false);
    setTool(null);
    isOpen = false;
    // Clear the hover-tilt's inline transform/vars so the tucked-position
    // CSS rule (scoped to .stage.closed) can take over cleanly.
    stopTilt();
    tiltFrozen = true;
    cardScene.style.transition = 'transform 0.62s cubic-bezier(0.45,0,0.15,1)';
    cardScene.style.transform = '';
    cardScene.style.removeProperty('--sx');
    cardScene.style.removeProperty('--sy');
    stage.classList.add('closed');
    stage.classList.remove('is-open');
    // Mirror of the open reveal: the card spins back as it tucks away. Matches
    // the 0.62s cardCloseSpin so the turn and the travel finish together.
    restartAnim('closing');
    setTimeout(()=>{ cardScene.style.transition = ''; }, 620);
  }
  btnClose.addEventListener('click', closeCard);
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && isOpen) closeCard();
  });

  // ---------- idle tilt: mouse on desktop, device gyroscope on phones ----------
  // The tilt eases toward a target inside a rAF loop instead of writing the
  // pointer position straight to `transform`. Writing it directly fought the
  // 0.2s CSS transition on .card-scene: every pointermove restarted a fresh
  // 200ms interpolation, so the card permanently chased the cursor and never
  // arrived. Easing per frame is frame-synced, and gives a real settle on
  // release rather than a snap.
  const tilt  = { x:0, y:0, tx:0, ty:0 };
  const sheen = { x:30, y:15, tx:30, ty:15 };   // neutral matches the CSS default
  let tiltRAF = null, tiltFrozen = false, sceneRect = null;

  // Reading the box on every pointermove forced a synchronous layout per
  // event; cache it and drop the cache when it can actually have moved.
  function sceneBox(){
    if(!sceneRect) sceneRect = cardScene.getBoundingClientRect();
    return sceneRect;
  }
  const invalidateBox = ()=>{ sceneRect = null; };
  window.addEventListener('resize', invalidateBox);
  window.addEventListener('scroll', invalidateBox, {passive:true});

  let tiltLast = 0;
  function tiltFrame(now){
    // Frame-rate independent easing. A fixed per-frame factor would settle
    // twice as fast on a 120Hz display as on 60Hz, so the same gesture would
    // feel different on a ProMotion screen. Deriving k from elapsed time keeps
    // the response identical; dt is clamped so a stalled tab (background
    // throttling) doesn't resume with one enormous jump.
    const dt = tiltLast ? Math.min(now - tiltLast, 64) : 16.667;
    tiltLast = now;
    const k = 1 - Math.pow(1 - 0.16, dt / 16.667);
    tilt.x  += (tilt.tx  - tilt.x)  * k;
    tilt.y  += (tilt.ty  - tilt.y)  * k;
    sheen.x += (sheen.tx - sheen.x) * k;
    sheen.y += (sheen.ty - sheen.y) * k;

    const done = Math.abs(tilt.tx - tilt.x) < 0.0008
              && Math.abs(tilt.ty - tilt.y) < 0.0008
              && Math.abs(sheen.tx - sheen.x) < 0.05
              && Math.abs(sheen.ty - sheen.y) < 0.05;
    if(done){ tilt.x = tilt.tx; tilt.y = tilt.ty; sheen.x = sheen.tx; sheen.y = sheen.ty; }

    cardScene.style.transform = `rotateY(${tilt.x*18}deg) rotateX(${-tilt.y*18}deg)`;
    cardScene.style.setProperty('--sx', `${sheen.x}%`);
    cardScene.style.setProperty('--sy', `${sheen.y}%`);

    if(done){ tiltRAF = null; cardScene.classList.remove('tilting'); return; }
    tiltRAF = requestAnimationFrame(tiltFrame);
  }
  function runTilt(){
    if(tiltRAF !== null) return;
    tiltLast = 0;
    cardScene.classList.add('tilting');   // hands motion to the loop, not CSS
    tiltRAF = requestAnimationFrame(tiltFrame);
  }
  function applyTilt(nx, ny){
    if(!isOpen || tiltFrozen) return;
    tilt.tx = nx; tilt.ty = ny;
    sheen.tx = (nx+0.5)*100; sheen.ty = (ny+0.5)*100;
    runTilt();
  }
  function releaseTilt(){
    if(!isOpen) return;
    tilt.tx = 0; tilt.ty = 0;
    sheen.tx = 30; sheen.ty = 15;
    runTilt();
  }
  // Hard stop, for closing: leaves no inline transform behind for the tucked
  // CSS rule to fight with.
  function stopTilt(){
    if(tiltRAF !== null){ cancelAnimationFrame(tiltRAF); tiltRAF = null; }
    tiltLast = 0;
    cardScene.classList.remove('tilting');
    tilt.x = tilt.tx = tilt.y = tilt.ty = 0;
    sheen.x = sheen.tx = 30; sheen.y = sheen.ty = 15;
  }

  // Tilt is direct manipulation (the visitor's own cursor/device drives it),
  // not autoplaying motion, so it stays on even under prefers-reduced-motion
  // — that setting is respected elsewhere, for the ambient ember particles.
  {
    // Pointer events rather than mouse events, so a stylus or a precision
    // trackpad drives the tilt too. Touch is skipped deliberately: on a phone
    // the gyroscope below already owns the tilt, and letting a finger drive it
    // as well made the card fight itself mid-drag.
    cardScene.addEventListener('pointermove', (e)=>{
      if(e.pointerType === 'touch') return;
      const r = sceneBox();
      if(!r.width) return;
      applyTilt((e.clientX-r.left)/r.width - 0.5, (e.clientY-r.top)/r.height - 0.5);
    });
    cardScene.addEventListener('pointerleave', (e)=>{
      if(e.pointerType === 'touch') return;
      releaseTilt();
    });

    // Phones: tilt the card by physically tilting the device, same idea as
    // the mouse-driven version above. beta/gamma report the phone's own
    // pitch/roll in degrees; 45deg beta is roughly how far back most people
    // hold a phone, so that's treated as the neutral/centered position.
    function handleOrientation(e){
      if(e.beta==null || e.gamma==null) return;
      const nx = Math.max(-0.5, Math.min(0.5, e.gamma/45));
      const ny = Math.max(-0.5, Math.min(0.5, (e.beta-45)/45));
      applyTilt(nx, ny);
    }
    function enableMotion(){
      window.addEventListener('deviceorientation', handleOrientation);
    }
    let motionAsked = false;
    window.askMotionPermission = function(){
      if(motionAsked) return;
      motionAsked = true;
      if(window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function'){
        // iOS only grants this from a direct user gesture. Calling it from a
        // separate document-wide pointerdown listener raced against the tap
        // that opens the card — the native permission sheet interrupting the
        // same touch gesture could eat the pending click, so the card never
        // opened. Calling it here, inside the click handler that opens the
        // card, keeps it on the same gesture instead of a competing one.
        DeviceOrientationEvent.requestPermission().then(state=>{
          if(state === 'granted') enableMotion();
        }).catch(()=>{});
      } else if(window.DeviceOrientationEvent){
        enableMotion();
      }
    };
  }
  // Painting/burning wants a still, flat card to aim at — freeze the tilt and
  // ease it back to neutral rather than letting the cursor swing it about.
  function settle(on){
    cardScene.classList.toggle('settled', on);
    tiltFrozen = on;
    if(on){
      tilt.tx = 0; tilt.ty = 0;
      sheen.tx = 30; sheen.ty = 15;
      runTilt();
    }
  }

  // ---------- flip ----------
  let flipped = false;
  function setFlipped(v){
    flipped = v;
    card.classList.toggle('flipped', flipped);
  }
  btnFlip.addEventListener('click', ()=> setFlipped(!flipped));

  // ---------- tool selection ----------
  let activeTool = null;
  function setTool(name){
    activeTool = activeTool === name ? null : name;
    [btnPaint, btnBurn].forEach(b=>b.classList.remove('active'));
    if(activeTool === 'paint') btnPaint.classList.add('active');
    if(activeTool === 'burn') btnBurn.classList.add('active');
  }
  btnPaint.addEventListener('click', ()=> setTool('paint'));
  btnBurn.addEventListener('click', ()=> setTool('burn'));

  // ---------- pointer mapping ----------
  // Paint/burn/shred work on whichever face is actually showing, not just
  // the front — resolved from the canvas the pointer event fired on.
  function ctxFor(canvas){ return canvas===frontCanvas ? fctx : bctx; }
  function mirrorCtxFor(canvas){ return canvas===frontCanvas ? bctx : fctx; }

  function toLocal(e, canvas){
    const rect = canvas.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x:(cx-rect.left)*(CARD_W/rect.width), y:(cy-rect.top)*(CARD_H/rect.height) };
  }

  // ---------- paint ----------
  const paintBase = [ [210,60,60], [70,80,140] ];
  function paintStamp(ctx, x,y){
    const [r,g,b] = paintBase[Math.floor(Math.random()*paintBase.length)];
    const jitter = ()=> Math.floor(Math.random()*24)-12;
    const radius = 5+Math.random()*10;
    const grad = ctx.createRadialGradient(x,y,0,x,y,radius);
    grad.addColorStop(0, `rgba(${r+jitter()},${g+jitter()},${b+jitter()},0.9)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x,y,radius,0,Math.PI*2);
    ctx.fill();
    for(let i=0;i<3;i++){
      const dx = x+(Math.random()-0.5)*30, dy = y+(Math.random()-0.5)*30;
      const r2 = 1+Math.random()*3;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${r},${g},${b},${0.3+Math.random()*0.3})`;
      ctx.arc(dx,dy,r2,0,Math.PI*2);
      ctx.fill();
    }
  }

  // ---------- burn ----------
  let burnHold = null;
  // Burns straight through the stock, so the same scorch has to land on both
  // canvases — mirrored left-right on the back, since flipping the card
  // swaps which physical edge is which from the viewer's side.
  function scorch(ctx, x, y, strength){
    const emberColor = '217,79,30';
    const charRadius = 10+strength*22;
    const holeRadius = charRadius*0.45;
    const glow = ctx.createRadialGradient(x,y,0,x,y,charRadius*1.6);
    glow.addColorStop(0, `rgba(${emberColor},${0.5*strength})`);
    glow.addColorStop(0.5, `rgba(60,30,10,${0.6*strength})`);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x,y,charRadius*1.6,0,Math.PI*2);
    ctx.fill();

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x,y,holeRadius,0,Math.PI*2);
    ctx.fillStyle = `rgba(0,0,0,${Math.min(1,strength)})`;
    ctx.fill();
    ctx.restore();
  }

  function burnAt(canvas, x,y,strength){
    scorch(ctxFor(canvas), x, y, strength);
    scorch(mirrorCtxFor(canvas), CARD_W-x, y, strength);
    if(!reducedMotion && Math.random()<0.5) spawnEmber(canvas, x,y);
  }

  const embers = [];
  function spawnEmber(canvas, x,y){
    const rect = canvas.getBoundingClientRect();
    const el = document.createElement('div');
    const size = 2+Math.random()*3;
    el.style.cssText = `position:absolute;left:${rect.left+ (x/CARD_W)*rect.width}px;top:${rect.top+(y/CARD_H)*rect.height}px;width:${size}px;height:${size}px;border-radius:50%;background:radial-gradient(circle, #ffb066, #d94f1e);pointer-events:none;z-index:50;box-shadow:0 0 6px 1px rgba(217,79,30,0.8);`;
    document.body.appendChild(el);
    const dx = (Math.random()-0.5)*40, dur = 600+Math.random()*500;
    el.animate([
      { transform:'translate(0,0)', opacity:1 },
      { transform:`translate(${dx}px, -${40+Math.random()*40}px)`, opacity:0 }
    ], { duration:dur, easing:'ease-out' }).onfinish = ()=> el.remove();
  }

  // ---------- interaction wiring ----------
  // Attached to both faces; backface-visibility keeps whichever one is
  // turned away from actually receiving pointer events, so no extra
  // flipped-state check is needed here.
  let drawing = false;
  [frontCanvas, backCanvas].forEach(canvas=>{
    canvas.addEventListener('pointerdown', (e)=>{
      if(!activeTool) return;
      drawing = true;
      settle(true);
      canvas.setPointerCapture(e.pointerId);
      handleMove(e, canvas);
    });
    canvas.addEventListener('pointermove', (e)=>{
      if(!drawing) return;
      handleMove(e, canvas);
    });
    ['pointerup','pointerleave','pointercancel'].forEach(evt=>{
      canvas.addEventListener(evt, ()=>{
        if(!drawing) return;
        drawing = false;
        burnHold = null;
        settle(false);
      });
    });
  });

  function handleMove(e, canvas){
    const {x,y} = toLocal(e, canvas);
    if(activeTool === 'paint'){
      paintStamp(ctxFor(canvas), x,y);
    } else if(activeTool === 'burn'){
      if(!burnHold) burnHold = { x, y, t:0, canvas };
      burnHold.x = x; burnHold.y = y;
      burnHold.t = Math.min(1, burnHold.t + 0.06);
      burnAt(canvas, x,y,burnHold.t);
    }
  }
  // continue charring while held in place
  setInterval(()=>{
    if(drawing && activeTool === 'burn' && burnHold){
      burnHold.t = Math.min(1, burnHold.t + 0.05);
      burnAt(burnHold.canvas, burnHold.x, burnHold.y, burnHold.t);
    }
  }, 60);

  // ---------- shred ----------
  const STRIP_COUNT = 12;
  const STRIP_DELAY_STEP = 35;
  const STRIP_FALL_MS = 1050;
  let shredded = false;
  let restoreTimer = null;

  btnShred.addEventListener('click', ()=>{
    if(shredded) return;
    shredded = true;
    const sourceCanvas = flipped ? backCanvas : frontCanvas;
    const rect = sourceCanvas.getBoundingClientRect();
    const stripW = CARD_W/STRIP_COUNT;
    const stripCssW = rect.width/STRIP_COUNT;
    const stage_rect = stage.getBoundingClientRect();
    const strips = [];

    for(let i=0;i<STRIP_COUNT;i++){
      const sc = document.createElement('canvas');
      sc.width = stripW*DPR; sc.height = CARD_H*DPR;
      sc.getContext('2d').drawImage(sourceCanvas, i*stripW*DPR,0, stripW*DPR, CARD_H*DPR, 0,0, stripW*DPR, CARD_H*DPR);
      const el = document.createElement('div');
      el.className = 'strip';
      el.style.left = (rect.left - stage_rect.left + i*stripCssW)+'px';
      el.style.top = (rect.top - stage_rect.top)+'px';
      el.style.width = stripCssW+'px';
      el.style.height = rect.height+'px';
      el.style.backgroundImage = `url(${sc.toDataURL()})`;
      el.style.backgroundSize = 'cover';
      stage.appendChild(el);
      strips.push(el);
    }
    // Hide the whole scene, not just the canvas — otherwise the card-face's
    // own shadow/sheen/border stay behind as an empty outline where the
    // card used to be.
    cardScene.style.visibility = 'hidden';

    // Fall well past the bottom of the viewport, not just the card's own
    // height, so every strip actually exits the screen.
    const exitDistance = (stage_rect.height - (rect.top - stage_rect.top)) + rect.height + 120;

    setTimeout(()=>{
      strips.forEach((el, i)=>{
        const fall = exitDistance + Math.random()*80;
        const rot = (Math.random()-0.5)*60;
        const drift = (Math.random()-0.5)*40;
        el.style.transitionDelay = (i*STRIP_DELAY_STEP)+'ms';
        el.style.transform = `translate(${drift}px, ${fall}px) rotate(${rot}deg)`;
      });
    }, 20);

    clearTimeout(restoreTimer);
    const totalMs = (STRIP_COUNT-1)*STRIP_DELAY_STEP + STRIP_FALL_MS + 150;
    restoreTimer = setTimeout(()=> restoreCard(true), totalMs);
  });

  // Shared by the automatic post-shred recovery and the manual Reset button.
  // `pop` plays a quick bounce-in for the scene when the fresh card arrives
  // on its own; a manual Reset just snaps it back instantly.
  function restoreCard(pop){
    document.querySelectorAll('.strip').forEach(el=> el.remove());
    shredded = false;
    drawFront();
    drawBack();
    if(flipped) setFlipped(false);
    setTool(null);

    if(pop){
      cardScene.style.transition = 'none';
      cardScene.style.opacity = '0';
      cardScene.style.transform = 'scale(0.75)';
      cardScene.style.visibility = 'visible';
      void cardScene.offsetWidth; // force reflow so the transition below actually animates
      cardScene.style.transition = 'transform 0.5s cubic-bezier(0.34,1.4,0.44,1), opacity 0.35s ease-out';
      cardScene.style.opacity = '1';
      cardScene.style.transform = 'scale(1)';
      setTimeout(()=>{
        cardScene.style.transition = '';
        cardScene.style.transform = '';
        cardScene.style.opacity = '';
      }, 520);
    } else {
      cardScene.style.visibility = 'visible';
    }
  }

  // ---------- reset ----------
  btnReset.addEventListener('click', ()=>{
    clearTimeout(restoreTimer);
    restoreCard(false);
  });

  setFlipped(false);



})();

