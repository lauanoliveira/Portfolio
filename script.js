/**
 * ==========================================================================
 * PORTFÓLIO LAUAN OLIVEIRA - COMPORTAMENTO & ANIMAÇÕES (Fase 0 e Fase 1)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    // Força o scroll no topo e impede a restauração automática do navegador no reload (F5)
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Referências do DOM
    const loadingScreen = document.getElementById("loading-screen");
    const heroSection = document.getElementById("hero-section");
    const scrollBtn = document.getElementById("scroll-btn");

    // Duração do Carregamento (5500 milissegundos para uma experiência premium e cinematográfica)
    const LOADING_DURATION = 5500;

    let isTransitionFinished = false;
    let currentLoadingProgress = 0; // Variável global de progresso (0 a 1)
    let techProgress = 0;

    // Inicializar Sistemas de Partículas e Alternadores
    initLoadingParticles();
    initHeroParticles();
    initTechChanger();
    initAboutParticles();
    initScrollReveal();
    initTimelineProgress();
    initSubtitleRotator();
    initJourneyScrollytelling();
    initTechStackPhysics();
    initTechJourney();
    initEndingJourney();

    // Iniciar Progresso da Barra
    startLoadingProgress();

    /**
     * ==========================================================================
     * LÓGICA DO PROGRESSO E TRANSIÇÃO (FASE 0 -> FASE 1)
     * ==========================================================================
     */
    function startLoadingProgress() {
        const startTime = performance.now();

        function updateProgress(currentTime) {
            const elapsedTime = currentTime - startTime;
            currentLoadingProgress = Math.min(elapsedTime / LOADING_DURATION, 1);

            // Revela gradualmente o conteúdo textual quando o progresso atinge 15%
            if (currentLoadingProgress >= 0.15) {
                const loadingContent = document.querySelector(".loading-content");
                if (loadingContent && !loadingContent.classList.contains("visible")) {
                    loadingContent.classList.add("visible");
                }
            }

            if (elapsedTime < LOADING_DURATION) {
                requestAnimationFrame(updateProgress);
            } else {
                completeLoading();
            }
        }

        requestAnimationFrame(updateProgress);
    }

    function completeLoading() {
        // 1. Adiciona classe de Fade Out na Tela de Carregamento
        loadingScreen.classList.add("fade-out");

        // 2. Após a animação de Fade Out (1200ms em CSS), oculta o loader e exibe o Hero
        setTimeout(() => {
            loadingScreen.style.display = "none";
            document.body.classList.remove("loading");

            // Prepara a seção principal para ser mostrada
            heroSection.classList.remove("hidden");

            // Dispara evento de redimensionamento para ajustar canvas e posições físicas das seções agora visíveis
            window.dispatchEvent(new Event('resize'));

            // Permite transição suave de escala/opacidade no Hero
            setTimeout(() => {
                heroSection.classList.add("visible");

                // Força o scroll no topo no momento exato em que a rolagem é liberada
                window.scrollTo(0, 0);

                // Permite rolagem da página (quando houver mais seções no futuro)
                document.body.style.overflow = "auto";

                // Ativa a interatividade do paralaxe após o término das animações de entrada
                setTimeout(() => {
                    isTransitionFinished = true;
                    heroSection.classList.add("ready"); // Remove transição do transform para permitir flutuação JS fluida
                }, 2000);
            }, 50);
        }, 1200);
    }

    /**
     * ==========================================================================
     * FASE 0: SISTEMA DE ESTRELAS E CONSTELAÇÃO NO CANVAS (NARRATIVA ESPACIAL)
     * ==========================================================================
     */
    function initLoadingParticles() {
        const canvas = document.getElementById("loading-canvas");
        const ctx = canvas.getContext("2d");
        let stars = [];
        let animationId;

        // Dimensões e posicionamento da constelação
        let centerX = canvas.width / 2;
        let centerY = canvas.height / 2;
        let scale = Math.min(canvas.width, canvas.height) * 0.28;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            centerX = canvas.width / 2;
            centerY = canvas.height / 2;
            scale = Math.min(canvas.width, canvas.height) * 0.28;
        }

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        // Estrelas de fundo
        class Star {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.0 + 0.3; // estrelas bem pequenas e delicadas
                this.maxOpacity = Math.random() * 0.5 + 0.1;
                this.opacity = 0;
                this.fadeSpeed = Math.random() * 0.005 + 0.002;
                this.fadeDirection = 1;
            }

            update() {
                // As estrelas de fundo começam a surgir lentamente conforme o progresso inicial do carregamento
                const globalFade = Math.min(1, currentLoadingProgress / 0.22); // surgem até 22% do progresso

                this.opacity += this.fadeSpeed * this.fadeDirection;
                if (this.opacity > this.maxOpacity) {
                    this.fadeDirection = -1;
                } else if (this.opacity < 0.05) {
                    this.fadeDirection = 1;
                }

                this.currentOpacity = this.opacity * globalFade;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.currentOpacity})`;
                ctx.fill();
            }
        }

        // Definição dos pontos da constelação (coordenadas relativas ao centro)
        const nodes = [
            { id: 0, x: -0.6, y: -0.4, startFade: 0.22, fullFade: 0.30 },
            { id: 1, x: -0.2, y: -0.6, startFade: 0.28, fullFade: 0.36 },
            { id: 2, x: 0.3, y: -0.5, startFade: 0.34, fullFade: 0.42 },
            { id: 3, x: 0.7, y: -0.2, startFade: 0.40, fullFade: 0.48 },
            { id: 4, x: 0.5, y: 0.4, startFade: 0.46, fullFade: 0.54 },
            { id: 5, x: 0.1, y: 0.6, startFade: 0.52, fullFade: 0.60 }, // Última estrela da constelação principal
            { id: 6, x: -0.4, y: 0.5, startFade: 0.58, fullFade: 0.66 },
            { id: 7, x: -0.7, y: 0.1, startFade: 0.64, fullFade: 0.72 }
        ];

        // Conexões ordenadas para a construção sequencial
        const connections = [
            { from: 0, to: 1 },
            { from: 1, to: 2 },
            { from: 2, to: 3 },
            { from: 3, to: 4 },
            { from: 4, to: 5 },
            { from: 5, to: 6 },
            { from: 6, to: 7 },
            { from: 7, to: 0 },
            { from: 1, to: 6 },
            { from: 2, to: 5 }
        ];

        // Criação de 50 estrelas para o plano de fundo
        const starCount = 50;
        for (let i = 0; i < starCount; i++) {
            stars.push(new Star());
        }

        function getNodeOpacity(node) {
            if (currentLoadingProgress < node.startFade) return 0;
            if (currentLoadingProgress >= node.fullFade) return 1.0;
            return (currentLoadingProgress - node.startFade) / (node.fullFade - node.startFade);
        }

        function getConnectionFraction(index) {
            // O desenho da constelação ocorre entre 22% e 82% do progresso total
            const rangeStart = 0.22;
            const rangeEnd = 0.82;
            const step = (rangeEnd - rangeStart) / connections.length; // 0.06 por conexão

            const start = rangeStart + index * step;
            const end = start + step;

            if (currentLoadingProgress < start) return 0;
            if (currentLoadingProgress >= end) return 1;
            return (currentLoadingProgress - start) / step;
        }

        // Loop principal da animação
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. Atualizar e desenhar estrelas de fundo
            stars.forEach(star => {
                star.update();
                star.draw();
            });

            // 2. Desenhar conexões da constelação
            connections.forEach((conn, index) => {
                const fraction = getConnectionFraction(index);
                if (fraction <= 0) return;

                const fromNode = nodes[conn.from];
                const toNode = nodes[conn.to];

                const x1 = centerX + fromNode.x * scale;
                const y1 = centerY + fromNode.y * scale;
                const x2 = centerX + toNode.x * scale;
                const y2 = centerY + toNode.y * scale;

                const currentX = x1 + (x2 - x1) * fraction;
                const currentY = y1 + (y2 - y1) * fraction;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(currentX, currentY);
                ctx.strokeStyle = `rgba(255, 255, 255, 0.12)`;
                ctx.lineWidth = 0.55;
                ctx.stroke();
            });

            // 3. Desenhar nós (estrelas principais)
            nodes.forEach(node => {
                const opacity = getNodeOpacity(node);
                if (opacity <= 0) return;

                const x = centerX + node.x * scale;
                const y = centerY + node.y * scale;

                let sizeMultiplier = 1.0;
                let glowMultiplier = 1.0;

                // A última estrela (ID: 5) pulsa quando a constelação se completa
                if (node.id === 5 && currentLoadingProgress >= 0.82) {
                    const pulseProgress = (currentLoadingProgress - 0.82) / 0.15; // De 82% a 97%
                    if (pulseProgress >= 0 && pulseProgress <= 1) {
                        const sinVal = Math.sin(pulseProgress * Math.PI);
                        sizeMultiplier = 1.0 + 0.3 * sinVal;
                        glowMultiplier = 1.0 + 1.2 * sinVal;
                    }
                }

                // Brilho externo sutil
                ctx.beginPath();
                ctx.arc(x, y, 4.5 * glowMultiplier, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.20 * (1.0 / sizeMultiplier)})`;
                ctx.fill();

                // Núcleo da estrela
                ctx.beginPath();
                ctx.arc(x, y, 1.25 * sizeMultiplier, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.85})`;
                ctx.fill();
            });

            animationId = requestAnimationFrame(animate);
        }

        animate();

        // Libera recursos e encerra loops ao terminar a fase de carregamento
        setTimeout(() => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", resizeCanvas);
        }, LOADING_DURATION + 1500);
    }

    /**
     * ==========================================================================
     * FASE 1: ESPAÇO ESTELAR DE CAMADAS PURAS (SEM NEBULOSAS) & PARALLAX INDIVIDUAL
     * ==========================================================================
     */
    function initHeroParticles() {
        const canvas = document.getElementById("hero-canvas");
        const ctx = canvas.getContext("2d");
        const heroContainer = document.querySelector(".hero-container");

        // Cache de elementos para Parallax de Translação proporcional e Z-depth
        const pretitle = document.querySelector(".hero-pretitle");
        const title = document.querySelector(".hero-title");
        const subtitle = document.querySelector(".hero-subtitle");
        const techChanger = document.querySelector(".hero-tech-changer");
        const bodyText = document.querySelector(".hero-body");
        const socialNav = document.querySelector(".social-nav");

        let stars3D = [];      // Estrelas hiperespaço radial 3D (drift para frente)
        let starsStatic = [];  // Estrelas distantes pequeninas (twinkling)
        let starsDrifting = []; // Estrelas médias com deriva diagonal lenta
        let cosmicDust = [];    // Poeira cósmica flutuante

        const maxDepth = 1000;
        const fov = 160;       // Field of View para projeção 3D

        let scrollY = 0;
        window.addEventListener("scroll", () => {
            scrollY = window.scrollY;

            // Scroll-linked reveal para o título Sobre Mim
            const aboutSection = document.getElementById("about-section");
            if (aboutSection) {
                const rect = aboutSection.getBoundingClientRect();
                const entryProgress = Math.max(0, Math.min(1.0, (window.innerHeight - rect.top) / (window.innerHeight * 0.7)));
                aboutSection.style.setProperty("--about-reveal-progress", entryProgress.toFixed(3));
            }
        }, { passive: true });

        // Coordenadas locais do mouse para Nome e Cargo (Efeito de Descoberta)
        let titleMouseX = 0, titleMouseY = 0;
        let smoothTitleX = 0, smoothTitleY = 0;
        let titleHoverTarget = 0, titleHoverFactor = 0;

        let subtitleMouseX = 0, subtitleMouseY = 0;
        let smoothSubtitleX = 0, smoothSubtitleY = 0;
        let subtitleHoverTarget = 0, subtitleHoverFactor = 0;

        // Bind local mouse interactions for Nome
        if (title) {
            title.addEventListener("mouseenter", () => {
                titleHoverTarget = 1;
            });
            title.addEventListener("mousemove", (event) => {
                const rect = title.getBoundingClientRect();
                titleMouseX = event.clientX - (rect.left + rect.width / 2);
                titleMouseY = event.clientY - (rect.top + rect.height / 2);
            });
            title.addEventListener("mouseleave", () => {
                titleHoverTarget = 0;
                titleMouseX = 0;
                titleMouseY = 0;
            });
        }

        // Bind local mouse interactions for Cargo
        if (subtitle) {
            subtitle.addEventListener("mouseenter", () => {
                subtitleHoverTarget = 1;
            });
            subtitle.addEventListener("mousemove", (event) => {
                const rect = subtitle.getBoundingClientRect();
                subtitleMouseX = event.clientX - (rect.left + rect.width / 2);
                subtitleMouseY = event.clientY - (rect.top + rect.height / 2);
            });
            subtitle.addEventListener("mouseleave", () => {
                subtitleHoverTarget = 0;
                subtitleMouseX = 0;
                subtitleMouseY = 0;
            });
        }

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initUniverse();
        }

        window.addEventListener("resize", resizeCanvas);

        // 1. Estrelas distantes (Twinkling)
        class StarStatic {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 0.45 + 0.15; // De 0.15px a 0.6px
                this.opacity = Math.random() * 0.45 + 0.15;
                this.fadeSpeed = Math.random() * 0.0015 + 0.0005;
                this.fadeDir = Math.random() > 0.5 ? 1 : -1;
            }

            update() {
                this.opacity += this.fadeSpeed * this.fadeDir;
                if (this.opacity > 0.6) this.fadeDir = -1;
                else if (this.opacity < 0.15) this.fadeDir = 1;
            }

            draw(offsetX, offsetY) {
                let rx = (this.x + offsetX) % canvas.width;
                let ry = (this.y + offsetY) % canvas.height;
                if (rx < 0) rx += canvas.width;
                if (ry < 0) ry += canvas.height;

                ctx.beginPath();
                ctx.arc(rx, ry, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        // 2. Estrelas com deriva diagonal lenta (Efeito vivo sutil)
        class StarDrift {
            constructor(sizeMin, sizeMax, baseSpeed) {
                this.sizeMin = sizeMin;
                this.sizeMax = sizeMax;
                this.baseSpeed = baseSpeed;
                this.reset();
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
            }

            reset() {
                if (Math.random() > 0.5) {
                    this.x = -20;
                    this.y = Math.random() * canvas.height;
                } else {
                    this.x = Math.random() * canvas.width;
                    this.y = -20;
                }

                this.size = Math.random() * (this.sizeMax - this.sizeMin) + this.sizeMin;

                const sizeRatio = this.size / this.sizeMax;
                const speed = this.baseSpeed * (0.5 + sizeRatio * 0.8) * (0.85 + Math.random() * 0.3);

                this.speedX = speed;
                this.speedY = Math.random() > 0.5 ? 0 : speed * 0.45;
                this.opacity = Math.random() * 0.35 + 0.1;

                this.isStreak = Math.random() > 0.7;
            }

            update(speedMult) {
                const multiplier = speedMult || 1.0;
                this.x += this.speedX * multiplier;
                this.y += this.speedY * multiplier;

                if (this.x > canvas.width + 20 || this.y > canvas.height + 20) {
                    this.reset();
                }
            }

            draw(offsetX, offsetY) {
                let rx = this.x + offsetX;
                let ry = this.y + offsetY;

                if (this.isStreak) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
                    ctx.lineWidth = this.size * 0.75;
                    const len = this.speedX * 12 + 2;
                    ctx.moveTo(rx - this.speedX * len, ry - this.speedY * len);
                    ctx.lineTo(rx, ry);
                    ctx.stroke();
                } else {
                    ctx.beginPath();
                    ctx.arc(rx, ry, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                    ctx.fill();
                }
            }
        }

        // 3. Estrelas Hiperespaço 3D Radial
        class Star3D {
            constructor() {
                this.reset();
                this.z = Math.random() * maxDepth;
            }

            reset() {
                this.x = (Math.random() - 0.5) * canvas.width * 1.5;
                this.y = (Math.random() - 0.5) * canvas.height * 1.5;
                this.z = maxDepth;
            }

            update(speed) {
                this.z -= speed;
                if (this.z <= speed) {
                    this.reset();
                }
            }

            draw(offsetX, offsetY, cx, cy, customFov) {
                const activeFov = customFov || fov;
                const px = (this.x / this.z) * activeFov + cx + offsetX;
                const py = (this.y / this.z) * activeFov + cy + offsetY;

                if (px < 0 || px > canvas.width || py < 0 || py > canvas.height) {
                    this.reset();
                    return;
                }

                const lenFactor = 1 - this.z / maxDepth;
                const lineLength = lenFactor * 10 + 0.5;

                const dx = px - (cx + offsetX);
                const dy = py - (cy + offsetY);
                const dist = Math.sqrt(dx * dx + dy * dy);

                const vx = dist > 0 ? (dx / dist) * lineLength : 0;
                const vy = dist > 0 ? (dy / dist) * lineLength : 0;

                let alpha = 1 - this.z / maxDepth;
                if (this.z < 150) {
                    alpha *= (this.z / 150);
                }
                alpha *= 0.16;

                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
                ctx.lineWidth = 0.35 + lenFactor * 0.35;
                ctx.moveTo(px - vx, py - vy);
                ctx.lineTo(px, py);
                ctx.stroke();
            }
        }

        // 4. Poeira Cósmica / Nebulosa
        class CosmicDust {
            constructor() {
                this.reset();
                this.x = Math.random() * canvas.width;
            }

            reset() {
                this.x = -150;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 90 + 55; // Partículas esfumaçadas de 55px a 145px
                this.speed = Math.random() * 0.3 + 0.12;
                this.color = Math.random() > 0.5 ? 'rgba(139, 92, 246, 0.035)' : 'rgba(14, 116, 144, 0.035)';
            }

            update(speedMult) {
                this.x += this.speed * speedMult;
                if (this.x > canvas.width + 150) {
                    this.reset();
                }
            }

            draw() {
                const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                grad.addColorStop(0, this.color);
                grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initUniverse() {
            stars3D = [];
            starsStatic = [];
            starsDrifting = [];
            cosmicDust = [];

            const area = canvas.width * canvas.height;

            const staticCount = Math.min(40, Math.floor(area / 40000));
            const driftCount = Math.min(48, Math.floor(area / 33000));
            const count3D = Math.min(12, Math.floor(area / 120000));
            const dustCount = 6;

            for (let i = 0; i < staticCount; i++) {
                starsStatic.push(new StarStatic());
            }
            for (let i = 0; i < driftCount; i++) {
                starsDrifting.push(new StarDrift(0.6, 1.4, 0.18));
            }
            for (let i = 0; i < count3D; i++) {
                stars3D.push(new Star3D());
            }
            for (let i = 0; i < dustCount; i++) {
                cosmicDust.push(new CosmicDust());
            }
        }

        function animateHero() {
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            const progress = Math.min(1.0, scrollY / window.innerHeight);
            const speedMult = 1.0 + progress * 3.5;
            const currentFov = fov + progress * 100;

            starsStatic.forEach(star => {
                star.update();
                star.draw(0, progress * 120);
            });

            starsDrifting.forEach(star => {
                star.update(speedMult);
                star.draw(0, progress * 80);
            });

            const speed3D = 0.65;
            stars3D.forEach(star => {
                star.update(speed3D * speedMult);
                star.draw(0, progress * 150, cx, cy, currentFov);
            });

            cosmicDust.forEach(dust => {
                dust.update(speedMult);
                dust.draw();
            });

            if (isTransitionFinished) {
                titleHoverFactor += (titleHoverTarget - titleHoverFactor) * 0.1;
                smoothTitleX += (titleMouseX - smoothTitleX) * 0.1;
                smoothTitleY += (titleMouseY - smoothTitleY) * 0.1;

                if (title) {
                    const tiltX = (smoothTitleY / 50) * -4.5;
                    const tiltY = (smoothTitleX / 150) * 4.5;
                    title.style.transform = `translate(${smoothTitleX * 0.08 * titleHoverFactor}px, ${smoothTitleY * 0.08 * titleHoverFactor}px) rotateX(${tiltX * titleHoverFactor}deg) rotateY(${tiltY * titleHoverFactor}deg) translateZ(50px)`;
                }

                subtitleHoverFactor += (subtitleHoverTarget - subtitleHoverFactor) * 0.1;
                smoothSubtitleX += (subtitleMouseX - smoothSubtitleX) * 0.1;
                smoothSubtitleY += (subtitleMouseY - smoothSubtitleY) * 0.1;

                if (subtitle) {
                    const tiltX = (smoothSubtitleY / 30) * -2.5;
                    const tiltY = (smoothSubtitleX / 200) * 2.5;
                    subtitle.style.transform = `translate(${smoothSubtitleX * 0.04 * subtitleHoverFactor}px, ${smoothSubtitleY * 0.04 * subtitleHoverFactor}px) rotateX(${tiltX * subtitleHoverFactor}deg) rotateY(${tiltY * subtitleHoverFactor}deg) translateZ(35px)`;
                }

                if (pretitle) pretitle.style.transform = "translateZ(20px)";
                if (techChanger) techChanger.style.transform = "translateZ(30px)";
                if (bodyText) bodyText.style.transform = "translateZ(15px)";
                if (socialNav) socialNav.style.transform = "translateZ(40px)";
            }

            requestAnimationFrame(animateHero);
        }

        resizeCanvas();
        animateHero();
    }

    /**
     * ==========================================================================
     * FASE 1: ALTERNADOR DINÂMICO DE TECNOLOGIAS (FADE + BLUR + SLIDE VERTICAL)
     * ==========================================================================
     */
    function initTechChanger() {
        const techElement = document.getElementById("dynamic-tech");
        if (!techElement) return;

        const techList = ["HTML", "CSS", "JavaScript"];
        let currentIndex = 0;

        setInterval(() => {
            techElement.style.opacity = 0;
            techElement.style.filter = "blur(4px)";
            techElement.style.transform = "translateY(-12px)";

            setTimeout(() => {
                currentIndex = (currentIndex + 1) % techList.length;
                const nextTech = techList[currentIndex];

                techElement.textContent = nextTech;

                const classSuffix = nextTech.toLowerCase()
                    .replace("javascript", "js")
                    .replace(" & ", "-");

                techElement.className = "tech-highlight " + classSuffix;

                techElement.style.transition = "none";
                techElement.style.transform = "translateY(12px)";

                techElement.offsetHeight;

                techElement.style.transition = "";

                requestAnimationFrame(() => {
                    techElement.style.opacity = 1;
                    techElement.style.filter = "blur(0px)";
                    techElement.style.transform = "translateY(0)";
                });
            }, 400);
        }, 3000);
    }

    /**
     * ==========================================================================
     * INTERAÇÕES DE ELEMENTOS (SETA DE ROLAGEM)
     * ==========================================================================
     */
    if (scrollBtn) {
        scrollBtn.addEventListener("click", () => {
            scrollBtn.style.transform = "translateX(-50%) scale(0.9)";
            setTimeout(() => {
                scrollBtn.style.transform = "translateX(-50%) scale(1)";
            }, 150);

            const aboutSection = document.getElementById("about-section");
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    }
});

/**
 * ==========================================================================
 * FASE 2: CANVAS DE ESTRELAS DISCRETAS (TWINKLING LENTO E LIMPO)
 * ==========================================================================
 */
function initAboutParticles() {
    const canvas = document.getElementById("about-canvas");
    const section = document.getElementById("about-section");
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    let width = 0, height = 0, animationId = null, visible = false;
    let mouseX = 0, mouseY = 0;

    // ═══════════════════════════════════════════════════════════
    // CONSTELAÇÃO — variáveis originais intactas
    // ═══════════════════════════════════════════════════════════
    const stars = Array.from({ length: 120 }, () => ({
        x: Math.random(), y: Math.random(),
        z: .2 + Math.random() * .8, phase: Math.random() * Math.PI * 2
    }));
    const trail = Array.from({ length: 140 }, () => ({
        offset: Math.random(), drift: (Math.random() - .5) * 9
    }));
    const constellationPoints = [
        [.50, .13], [.60, .37], [.88, .39], [.67, .57], [.75, .87],
        [.50, .70], [.25, .87], [.33, .57], [.12, .39], [.40, .37]
    ];

    // ═══════════════════════════════════════════════════════════
    // NÚCLEO ESTELAR — partículas de plasma e órbita
    // ═══════════════════════════════════════════════════════════
    const dustOrbit = Array.from({ length: 80 }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: 14 + Math.random() * 22,
        tiltSin: 0.28 + Math.random() * 0.35,   // compressão vertical → disco inclinado
        baseSpeed: (Math.random() > .5 ? 1 : -1) * (.012 + Math.random() * .018),
        speed: (Math.random() > .5 ? 1 : -1) * (.012 + Math.random() * .018),
        size: .3 + Math.random() * 1.2,
        alpha: .15 + Math.random() * .5,
        hue: Math.random() > .6 ? "255, 200, 120" : "255, 240, 180"
    }));
    const plasmaBlobs = Array.from({ length: 9 }, (_, i) => ({
        baseAngle: (i / 9) * Math.PI * 2,
        ra: 5 + Math.random() * 4,
        rb: 3 + Math.random() * 3,
        speed: .0003 + Math.random() * .0006,
        phase: Math.random() * Math.PI * 2,
        hot: Math.random() > .5
    }));
    const coronaFlares = Array.from({ length: 7 }, () => ({
        angle: Math.random() * Math.PI * 2,
        length: 18 + Math.random() * 30,
        lw: 1 + Math.random() * 2,
        baseSpeed: .0002 + Math.random() * .0004,
        speed: .0002 + Math.random() * .0004,
        phase: Math.random() * Math.PI * 2,
        alpha: .2 + Math.random() * .4
    }));
    const galaxyBg = Array.from({ length: 500 }, () => ({
        x: Math.random(), y: Math.random(),
        sz: Math.random() * 1.1 + .12,
        br: Math.random(),
        ps: .001 + Math.random() * .002,
        ph: Math.random() * Math.PI * 2
    }));

    // ═══════════════════════════════════════════════════════════
    // NARRATIVA — capítulos com frase poética + conteúdo
    // ═══════════════════════════════════════════════════════════
    const CHAPTERS = [
        {
            poem: "A curiosidade é o primeiro brilho de qualquer descoberta.",
            title: "Iniciativa",
            body: "Acredito que a curiosidade é uma das habilidades mais importantes para quem trabalha com tecnologia.",
            start: 0.22, end: 0.37, physics: "spiral"
        },
        {
            poem: "Compreender o que existe por trás de cada resposta.",
            title: "Mentalidade",
            body: "Sempre que encontro algo que não conheço, procuro entender não apenas a resposta, mas também o que existe por trás dela. Essa mentalidade me levou a estudar programação, onde descobri uma área em constante evolução e cheia de oportunidades para aprender.",
            start: 0.37, end: 0.52, physics: "magnetic"
        },
        {
            poem: "Habilidades que se transformam ao longo do tempo.",
            title: "Comunicação e Análise",
            body: "Antes da tecnologia, atuei por mais de três anos com suporte técnico e atendimento ao cliente. Foi nesse período que desenvolvi habilidades de comunicação, análise de problemas e busca por soluções, competências que hoje aplico diariamente nos meus estudos e projetos.",
            start: 0.52, end: 0.67, physics: "meteor"
        },
        {
            poem: "A evolução é um processo de prática constante.",
            title: "Front-End",
            body: "Atualmente estou aprofundando meus conhecimentos em desenvolvimento Front-End, construindo projetos com HTML, CSS e JavaScript e transformando curiosidade em experiência prática.",
            start: 0.67, end: 0.82, physics: "vortex"
        }
    ];

    const LANGUAGES = [
        { name: "Português", level: "Nativo",         flag: "🇧🇷", col: "74,222,128",  r: 72,  spd:  .0009, ph: 0,               ha: 0 },
        { name: "Inglês",    level: "Em aprendizado", flag: "🇺🇸", col: "96,165,250",  r: 110, spd: -.0007, ph: Math.PI * .5,    ha: 0 },
        { name: "Espanhol",  level: "Em aprendizado", flag: "🇪🇸", col: "248,113,113", r: 148, spd:  .0006, ph: Math.PI,          ha: 0 },
        { name: "Japonês",   level: "Em aprendizado", flag: "🇯🇵", col: "244,114,182", r: 186, spd: -.0005, ph: Math.PI * 1.5,   ha: 0 }
    ];

    // Estado da narrativa
    let currentChIdx = -1;
    let poemPool = [];      // partículas da frase poética
    let contentPool = [];   // partículas do título + corpo
    let dissolvePool = [];  // partículas em retorno à estrela
    let lastPhase = "";     // "poem" | "content" | "none"
    let starPulse = 0;
    let mouseCanvasX = -9999, mouseCanvasY = -9999;
    // Visibilidade suavizada do texto (lerp) — controla dimming do fundo
    let smoothedTextVis = 0;

    // ═══════════════════════════════════════════════════════════
    // UTILITÁRIOS
    // ═══════════════════════════════════════════════════════════
    function resize() {
        width  = canvas.width  = canvas.clientWidth  * devicePixelRatio;
        height = canvas.height = canvas.clientHeight * devicePixelRatio;
        ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        width  = canvas.clientWidth;
        height = canvas.clientHeight;
    }
    function progress() {
        const rect = section.getBoundingClientRect();
        return Math.max(0, Math.min(1, -rect.top / Math.max(1, section.offsetHeight - innerHeight)));
    }
    const fade = (v, s, e) => Math.max(0, Math.min(1, (v - s) / (e - s)));
    function curve(x1, y1, x2, y2, bend, alpha) {
        ctx.beginPath(); ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(x1 + bend, y1 - 55, x2 - bend, y2 + 55, x2, y2);
        ctx.strokeStyle = `rgba(190,204,221,${alpha})`; ctx.lineWidth = .65; ctx.stroke();
    }

    // ═══════════════════════════════════════════════════════════
    // LAYOUT DE TEXTO → posições de cada caractere
    // ═══════════════════════════════════════════════════════════
    function buildLayout(text, type) {
        // type: "poem" | "title" | "body"
        const tmp = document.createElement("canvas").getContext("2d");
        let font, col, maxW, lineH, baseY;

        if (type === "poem") {
            font  = "italic 600 21px 'Cormorant Garamond',serif";
            col   = "rgba(250,250,250,OP)";
            maxW  = 520; lineH = 34; baseY = height * .5 - 52;
        } else if (type === "title") {
            font  = "600 20px 'Sora',sans-serif";
            col   = "rgba(252,252,252,OP)";
            maxW  = 560; lineH = 32; baseY = height * .5 - 68;
        } else { // body
            font  = "400 15px 'Inter',sans-serif";
            col   = "rgba(226,231,240,OP)";
            maxW  = 520; lineH = 28; baseY = height * .5 - 12;
        }
        tmp.font = font;

        // word-wrap
        const words = text.split(" ");
        const lines = [];
        let line = "";
        for (const w of words) {
            const test = line ? line + " " + w : w;
            if (tmp.measureText(test).width > maxW && line) { lines.push(line); line = w; }
            else line = test;
        }
        if (line) lines.push(line);

        const chars = [];
        let cy = baseY;
        for (const ln of lines) {
            tmp.font = font;
            const lw = tmp.measureText(ln).width;
            let cx = (width - lw) / 2;
            for (const ch of ln) {
                const cw = tmp.measureText(ch).width;
                chars.push({ ch, font, col, tx: cx + cw / 2, ty: cy });
                cx += cw;
            }
            cy += lineH;
        }
        return chars;
    }

    // ═══════════════════════════════════════════════════════════
    // CRIAR POOL DE PARTÍCULAS a partir do layout
    // ═══════════════════════════════════════════════════════════
    function makeParticles(chars, fromX, fromY, phys) {
        return chars.map((c, i) => {
            const angle = Math.random() * Math.PI * 2;
            let orbitX, orbitY;
            const orR = 60 + Math.random() * 100;
            switch (phys) {
                case "spiral": {
                    const sa = (i / chars.length) * Math.PI * 10;
                    orbitX = fromX + Math.cos(sa) * orR * .5;
                    orbitY = fromY + Math.sin(sa) * orR * .5;
                    break;
                }
                case "magnetic": {
                    const side = i % 2 === 0 ? 1 : -1;
                    orbitX = fromX + side * (30 + Math.random() * 80);
                    orbitY = fromY - (20 + Math.random() * 60);
                    break;
                }
                case "meteor":
                    orbitX = fromX + (Math.random() - .5) * 120;
                    orbitY = fromY - (50 + Math.random() * 80);
                    break;
                case "vortex":
                    orbitX = fromX - Math.sin(angle) * orR;
                    orbitY = fromY + Math.cos(angle) * orR * .6;
                    break;
                case "burst":
                    orbitX = fromX + Math.cos(angle) * (orR + 20);
                    orbitY = fromY + Math.sin(angle) * (orR + 20);
                    break;
                default: // cloud
                    orbitX = fromX + Math.cos(angle) * orR * .7;
                    orbitY = fromY + Math.sin(angle) * orR * .7;
            }
            return {
                ch: c.ch, font: c.font, col: c.col,
                x0: fromX, y0: fromY,        // nascimento (estrela)
                xO: orbitX, yO: orbitY,      // ponto de órbita transitório
                tx: c.tx, ty: c.ty,          // destino (letra)
                seed: i * .37 + Math.random() * 6.28
            };
        });
    }

    // ═══════════════════════════════════════════════════════════
    // RENDERIZAR pool de partículas com t ∈ [0,1]
    //   t=0 → na estrela  t=1 → no texto  t>1 → retorno
    // ═══════════════════════════════════════════════════════════
    function renderPool(pool, t, globalOpacity, time) {
        if (!pool.length || globalOpacity < .005) return;
        pool.forEach(p => {
            // trajetória: estrela → órbita → texto
            let px, py;
            if (t <= .35) {
                const tt = t / .35;
                const e = tt * tt * (3 - 2 * tt); // ease
                px = p.x0 + (p.xO - p.x0) * e;
                py = p.y0 + (p.yO - p.y0) * e;
            } else {
                const tt = (t - .35) / .65;
                const e = tt * tt * (3 - 2 * tt);
                px = p.xO + (p.tx - p.xO) * e;
                py = p.yO + (p.ty - p.yO) * e;
            }

            const dist = Math.sqrt((px - p.tx) ** 2 + (py - p.ty) ** 2);
            const condensed = dist < 20 && t >= .35;

            ctx.save();
            if (condensed) {
                // letra legível + micro-flutuação orgânica
                const fx = px + Math.sin(time * .0008 + p.seed) * .6;
                const fy = py + Math.cos(time * .001 + p.seed) * .5;
                const charOp = (0.65 + 0.35 * (1 - dist / 20)) * globalOpacity;
                ctx.font = p.font;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                // Sombra discreta para separar do fundo animado
                ctx.shadowColor = "rgba(0,0,0,0.65)";
                ctx.shadowBlur = 18;
                ctx.shadowOffsetY = 2;
                ctx.fillStyle = p.col.replace("OP", charOp.toFixed(3));
                ctx.fillText(p.ch, fx, fy);
                ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
                // poeira residual enquanto condensa
                if (dist > 2) {
                    ctx.fillStyle = `rgba(255,255,255,${(dist / 20) * globalOpacity * .4})`;
                    ctx.beginPath(); ctx.arc(px, py, 1 + Math.random() * .8, 0, Math.PI * 2); ctx.fill();
                }
            } else {
                // partícula de poeira viajando
                ctx.fillStyle = `rgba(235,248,255,${globalOpacity * .65})`;
                ctx.beginPath(); ctx.arc(px, py, .7 + Math.random() * 1.0, 0, Math.PI * 2); ctx.fill();
            }
            ctx.restore();
        });
    }

    // ═══════════════════════════════════════════════════════════
    // ESTRELA PROTOESTELAR REALISTA
    // ═══════════════════════════════════════════════════════════
    function drawStellarCore(cx, cy, time, pulseBoost, globalAlpha, sc) {
        const a = globalAlpha;
        if (a < .005) return;

        // 1 — Nebulosa externa (halo distante azul-violeta)
        const nr = 180 * sc;
        const nebula = ctx.createRadialGradient(cx, cy, 0, cx, cy, nr);
        nebula.addColorStop(0,   `rgba(60,100,200,${.07 * a})`);
        nebula.addColorStop(.5,  `rgba(100,50,160,${.04 * a})`);
        nebula.addColorStop(1,   "rgba(0,0,0,0)");
        ctx.fillStyle = nebula;
        ctx.beginPath(); ctx.arc(cx, cy, nr, 0, Math.PI * 2); ctx.fill();

        // 2 — Corona média laranja-branco animada
        const corR = (50 + Math.sin(time * .0015) * 6 + pulseBoost * 28) * sc;
        const corona = ctx.createRadialGradient(cx, cy, 0, cx, cy, corR);
        corona.addColorStop(0,    `rgba(255,250,220,${.72 * a})`);
        corona.addColorStop(.22,  `rgba(255,185,80,${.55 * a})`);
        corona.addColorStop(.5,   `rgba(200,90,40,${.22 * a})`);
        corona.addColorStop(.78,  `rgba(90,30,110,${.08 * a})`);
        corona.addColorStop(1,    "rgba(0,0,0,0)");
        ctx.fillStyle = corona;
        ctx.beginPath(); ctx.arc(cx, cy, corR, 0, Math.PI * 2); ctx.fill();

        // 3 — Plasma blobs (atividade superficial)
        plasmaBlobs.forEach(b => {
            b.phase += b.speed;
            const ba = b.baseAngle + Math.sin(b.phase * .7) * .9;
            const bd = (5 + Math.sin(b.phase) * 3.5) * sc;
            const bx = cx + Math.cos(ba) * bd;
            const by = cy + Math.sin(ba) * bd;
            const br = (b.ra + Math.sin(b.phase * 1.4) * b.rb) * sc;
            const hue = b.hot ? "255,200,100" : "255,230,150";
            // a já carrega o dimming — plasma some suavemente durante leitura
            ctx.fillStyle = `rgba(${hue},${.38 * a})`;
            ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill();
        });

        // 4 — Núcleo estelar brilhante com pulso respiratório
        const coreR = (9 + Math.sin(time * .002) * 1.5 + pulseBoost * 5) * sc;
        const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
        core.addColorStop(0,    `rgba(255,255,255,${a})`);
        core.addColorStop(.35,  `rgba(255,248,225,${.95 * a})`);
        core.addColorStop(.7,   `rgba(255,195,100,${.7 * a})`);
        core.addColorStop(1,    "rgba(255,130,40,0)");
        ctx.fillStyle = core;
        ctx.beginPath(); ctx.arc(cx, cy, coreR, 0, Math.PI * 2); ctx.fill();

        // 5 — Filamentos da coroa magnética (ejeções sutis)
        coronaFlares.forEach(f => {
            f.phase += f.speed;
            const fa = f.angle + Math.sin(f.phase) * .3;
            const r0 = coreR * 1.1;
            const r1 = r0 + f.length * sc;
            const sx = cx + Math.cos(fa) * r0, sy = cy + Math.sin(fa) * r0;
            const ex = cx + Math.cos(fa + .28) * r1, ey = cy + Math.sin(fa + .28) * r1;
            const mx = (sx + ex) * .5 + Math.cos(fa + Math.PI * .5) * r0 * .35;
            const my = (sy + ey) * .5 + Math.sin(fa + Math.PI * .5) * r0 * .35;
            ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(mx, my, ex, ey);
            ctx.strokeStyle = `rgba(255,215,130,${f.alpha * (.3 + Math.sin(f.phase) * .18) * a})`;
            ctx.lineWidth = f.lw * sc; ctx.lineCap = "round"; ctx.stroke();
        });

        // 6 — Disco de poeira orbital (anel inclinado) — velocidade modulada via d.speed
        dustOrbit.forEach(d => {
            d.angle += d.speed;
            const dr = d.radius * sc;
            const dx = cx + Math.cos(d.angle) * dr;
            const dy = cy + Math.sin(d.angle) * dr * d.tiltSin;
            ctx.fillStyle = `rgba(${d.hue},${d.alpha * a})`;
            ctx.beginPath(); ctx.arc(dx, dy, d.size * sc, 0, Math.PI * 2); ctx.fill();
        });

        // 7 — Ponto central ultra-brilhante
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.beginPath(); ctx.arc(cx, cy, 2.8 * sc, 0, Math.PI * 2); ctx.fill();
    }

    // ═══════════════════════════════════════════════════════════
    // LOOP PRINCIPAL
    // ═══════════════════════════════════════════════════════════
    function draw(time) {
        if (!visible) { animationId = null; return; }
        const ps = progress(); // p_scroll global [0, 1]

        // canvas fade
        ps > .01 && ps < .99
            ? canvas.classList.add("fade-in-active")
            : canvas.classList.remove("fade-in-active");

        // esconde reflexões HTML legadas
        section.querySelectorAll(".about-reflection-item").forEach(el => el.classList.remove("active"));

        ctx.clearRect(0, 0, width, height);

        // ── fundo estrelado (twinkling) — atenuado durante leitura ──
        const voidA = 1 - fade(ps, .02, .08) * .55;
        // Fator de dimming das estrelas: reduz 70% quando texto totalmente visível
        const starDimFactor = 1 - smoothedTextVis * 0.70;
        stars.forEach(s => {
            const sx = s.x * width  + mouseX * s.z * 12;
            const sy = s.y * height + mouseY * s.z * 12;
            const sa = (.08 + (Math.sin(time * .00045 + s.phase) + 1) * .05) * voidA * starDimFactor;
            ctx.fillStyle = `rgba(214,225,238,${sa})`;
            ctx.beginPath(); ctx.arc(sx, sy, s.z * .8, 0, Math.PI * 2); ctx.fill();
        });

        // ══════════════════════════════════════════════════════
        // FASE 1 — CONSTELAÇÃO (código original intacto)
        // Mapeado para p_scroll 0.0 → 0.22
        // ══════════════════════════════════════════════════════
        const p = Math.min(1.0, ps / 0.22);

        const zoom = 1 + Math.sin(p * Math.PI) * .035;
        const rawPoints = constellationPoints.map(([x, y]) => [
            width * .5 + (x * width - width * .5) * zoom,
            height * .5 + (y * height - height * .5) * zoom
        ]);
        const discoveryMarks = [.09, .28, .40, .52, .64, .76, .80, .84, .88, .92];
        let discovered = 1;
        discoveryMarks.slice(1).forEach(mark => { if (p >= mark) discovered++; });
        const travelMarks = discoveryMarks.slice(0, 6);
        let travelSegment = 0;
        while (travelSegment < travelMarks.length - 1 && p > travelMarks[travelSegment + 1]) travelSegment++;
        const segSt  = travelMarks[travelSegment];
        const segEnd = travelMarks[Math.min(travelSegment + 1, travelMarks.length - 1)];
        const segP   = segEnd === segSt ? 1 : Math.max(0, Math.min(1, (p - segSt) / (segEnd - segSt)));
        const easedP = segP * segP * (3 - 2 * segP);
        const rS = rawPoints[travelSegment];
        const rE = rawPoints[Math.min(travelSegment + 1, travelMarks.length - 1)];
        const protagonist = [rS[0] + (rE[0] - rS[0]) * easedP, rS[1] + (rE[1] - rS[1]) * easedP];
        const follow  = p < .84 ? .16 : .16 * (1 - fade(p, .84, .98));
        const camX = (width  * .5 - protagonist[0]) * follow;
        const camY = (height * .5 - protagonist[1]) * follow;
        const points  = rawPoints.map(([x, y]) => [x + camX, y + camY]);
        const starDot = [protagonist[0] + camX, protagonist[1] + camY];
        const departure = 1 - fade(p, .985, 1);

        for (let i = 1; i < discovered; i++) {
            const [fx, fy] = points[i - 1], [tx_, ty_] = points[i];
            curve(fx, fy, tx_, ty_, i % 2 ? -28 : 28, .1 * departure);
        }
        if (travelSegment < travelMarks.length - 1) {
            const [fx, fy] = points[travelSegment];
            curve(fx, fy, starDot[0], starDot[1], travelSegment % 2 ? -28 : 28, .16 * departure);
        }
        for (let i = 0; i < discovered; i++) {
            const [x, y] = points[i];
            const pls = i === discovered - 1 && p < .84 ? .3 + (Math.sin(time * .003) + 1) * .18 : .16;
            ctx.fillStyle = `rgba(225,234,245,${(.55 + pls) * departure})`;
            ctx.beginPath(); ctx.arc(x, y, i === discovered - 1 ? 2.9 : 1.8, 0, Math.PI * 2); ctx.fill();
            if (i === discovered - 1 && i > 0 && p < .84) {
                const [fx, fy] = points[i - 1];
                const arrival = fade(p, discoveryMarks[i] || .84, (discoveryMarks[i] || .84) + .07);
                trail.forEach(dot => {
                    if (dot.offset > arrival) return;
                    const t_ = dot.offset;
                    const px_ = fx + (x - fx) * t_ + Math.sin(t_ * Math.PI) * dot.drift;
                    const py_ = fy + (y - fy) * t_ - Math.sin(t_ * Math.PI) * dot.drift;
                    ctx.fillStyle = `rgba(205,220,237,${.18 * (1 - t_) * departure})`;
                    ctx.fillRect(px_, py_, 1, 1);
                });
            }
        }
        const finale = fade(p, .84, .98);
        if (finale > 0) {
            for (let i = 0; i < points.length; i++) {
                const next = (i + 1) % points.length;
                const lp = Math.max(0, Math.min(1, (finale * 11) - i));
                if (!lp) continue;
                const [fx, fy] = points[i], [tx_, ty_] = points[next];
                const bend = (i % 2 ? -1 : 1) * 48;
                curve(fx, fy, fx + (tx_ - fx) * lp, fy + (ty_ - fy) * lp, bend, .42 * Math.min(1, lp * 2) * departure);
            }
        }
        // Ponto simples durante constelação (sumirá com departure)
        if (departure > .01) {
            ctx.fillStyle = `rgba(235,242,249,${(.55 + (Math.sin(time * .0032) + 1) * .18) * departure})`;
            ctx.beginPath(); ctx.arc(starDot[0], starDot[1], 3.1, 0, Math.PI * 2); ctx.fill();
        }

        // ══════════════════════════════════════════════════════
        // FASE 2+ — ESTRELA PROTOESTELAR + NARRATIVA
        // ══════════════════════════════════════════════════════
        if (ps < 0.22) {
            animationId = requestAnimationFrame(draw);
            return;
        }

        // posição central estável da estrela
        const sCX = width  * .5;
        const sCY = height * .5;

        // zoom-out cosmológico (0.92 → 1.0)
        let sc = 1.0, camOY = 0;
        if (ps > 0.92) {
            const zp = fade(ps, 0.92, 0.985);
            sc    = 1.0 - zp * .84;
            camOY = zp * -230;
        }
        const rCX = sCX, rCY = sCY + camOY;

        // decaimento do pulso
        starPulse *= .92;

        // ── GESTÃO DOS CAPÍTULOS ── (calculado antes do draw para modular fundo)
        let activeIdx = -1;
        CHAPTERS.forEach((ch, i) => { if (ps >= ch.start && ps < ch.end) activeIdx = i; });

        // Calcula visibilidade instantânea do texto
        let textVisibility = 0;
        let poemOp = 0, contOp = 0;
        let poemT = 0, contT = 0;
        if (activeIdx !== -1) {
            const ch = CHAPTERS[activeIdx];
            const lp = (ps - ch.start) / (ch.end - ch.start);
            const poemOpA = fade(lp, .08, .22);
            const poemOpB = 1 - fade(lp, .42, .52);
            poemOp  = Math.min(poemOpA, poemOpB);
            poemT   = fade(lp, .08, .25);
            const contOpA = fade(lp, .52, .65);
            const contOpB = 1 - fade(lp, .85, .98);
            contOp  = Math.min(contOpA, contOpB);
            contT   = fade(lp, .52, .68);
            textVisibility = Math.max(poemOp, contOp);
        }

        // Lerp suavizado — transição cinematográfica (nunca corte abrupto)
        const lerpSpeed = 0.035;
        smoothedTextVis += (textVisibility - smoothedTextVis) * lerpSpeed;

        // Alpha da estrela: mín 0.14 durante leitura total, volta a 1.0 suavemente
        const coreAlpha = 1.0 - smoothedTextVis * 0.86;

        // Velocidade das partículas orbitais: desacelera 80% durante leitura
        const particleSpeedFactor = 1 - smoothedTextVis * 0.80;
        dustOrbit.forEach(d    => { d.speed = d.baseSpeed * particleSpeedFactor; });
        coronaFlares.forEach(f => { f.speed = f.baseSpeed * particleSpeedFactor; });

        // ESTRELA REALISTA (com alpha modulado)
        drawStellarCore(rCX, rCY, time, starPulse, coreAlpha, sc);

        // ── VINHETA DE LEITURA ──
        // Gradiente radial escuro centrado no texto — aparece suavemente com o texto
        if (smoothedTextVis > 0.01) {
            const vx = rCX, vy = rCY;
            const vR = Math.min(width, height) * 0.54;
            const vignette = ctx.createRadialGradient(vx, vy, vR * 0.10, vx, vy, vR);
            const vA = smoothedTextVis * 0.68; // máx ~0.68 de opacidade — muito sutil
            vignette.addColorStop(0,    `rgba(0,0,0,0)`);
            vignette.addColorStop(0.38, `rgba(0,0,0,0)`);
            vignette.addColorStop(0.72, `rgba(0,0,4,${vA * 0.5})`);
            vignette.addColorStop(1,    `rgba(0,0,8,${vA})`);
            ctx.fillStyle = vignette;
            ctx.fillRect(0, 0, width, height);
        }

        if (activeIdx !== currentChIdx) {
            // Capítulo mudou → pulsar estrela e recriar pools
            currentChIdx = activeIdx;
            starPulse = 1.2;
            poemPool    = [];
            contentPool = [];
            lastPhase   = "";

            if (activeIdx !== -1) {
                const ch = CHAPTERS[activeIdx];
                const poemChars    = buildLayout(ch.poem,  "poem");
                const titleChars   = buildLayout(ch.title, "title");
                const bodyChars    = buildLayout(ch.body,  "body");
                poemPool    = makeParticles(poemChars,                    rCX, rCY, ch.physics);
                contentPool = makeParticles([...titleChars, ...bodyChars], rCX, rCY, ch.physics);
            }
        }

        // anima os pools do capítulo ativo
        if (activeIdx !== -1) {
            if (poemOp > .005)
                renderPool(poemPool, poemT, poemOp, time);
            if (contOp > .005)
                renderPool(contentPool, contT, contOp, time);
        }

        // ── IDIOMAS EM ÓRBITA (ps 0.82 → 0.92) ──
        const langA = fade(ps, .82, .86) * (1 - fade(ps, .92, .96));
        if (langA > .005) {
            LANGUAGES.forEach(lg => {
                lg.ph += lg.spd * 16;
                const lr = lg.r * sc;
                const lx = rCX + Math.cos(lg.ph) * lr;
                const ly = rCY + Math.sin(lg.ph) * lr * .45; // disco inclinado
                const md = Math.hypot(mouseCanvasX - lx, mouseCanvasY - ly);
                lg.ha += ((md < 24 ? 1 : 0) - lg.ha) * .1;

                ctx.save();
                const gs = (5 + lg.ha * 4) * sc;
                const gA = 14 + lg.ha * 9;
                const grd = ctx.createRadialGradient(lx, ly, 0, lx, ly, gA * sc);
                grd.addColorStop(0,   `rgba(${lg.col},${.8 * langA})`);
                grd.addColorStop(.4,  `rgba(${lg.col},${.4 * langA})`);
                grd.addColorStop(1,   "rgba(0,0,0,0)");
                ctx.fillStyle = grd;
                ctx.beginPath(); ctx.arc(lx, ly, gA * sc, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = `rgba(255,255,255,${.92 * langA})`;
                ctx.beginPath(); ctx.arc(lx, ly, gs * .65, 0, Math.PI * 2); ctx.fill();

                if (lg.ha > .02) {
                    const to = lg.ha * langA;
                    const bw = 130, bh = 44;
                    const bx = lx + 18 * sc, by = ly - 14;
                    ctx.fillStyle   = `rgba(4,6,12,${.75 * to})`;
                    ctx.strokeStyle = `rgba(${lg.col},${.4 * to})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 7); ctx.fill(); ctx.stroke();
                    ctx.font = `600 12px 'Geist Sans',sans-serif`;
                    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
                    ctx.fillStyle = `rgba(240,246,255,${to})`;
                    ctx.fillText(`${lg.flag} ${lg.name}`, bx + 10, by + 16);
                    ctx.font = `italic 300 11px 'Cormorant Garamond',serif`;
                    ctx.fillStyle = `rgba(155,180,210,${to})`;
                    ctx.fillText(lg.level, bx + 10, by + 32);
                }
                ctx.restore();
            });
        }

        // ── GALÁXIA ZOOM-OUT (ps 0.92 → 1.0) ──
        const galA = fade(ps, .92, .98);
        if (galA > .005) {
            galaxyBg.forEach(s => {
                const gx = s.x * width  + mouseX * s.br * 18;
                const gy = s.y * height + camOY * s.br * .55;
                const ga = s.br * (.35 + .65 * Math.sin(time * s.ps + s.ph)) * galA;
                ctx.fillStyle = `rgba(240,246,255,${ga})`;
                ctx.beginPath(); ctx.arc(gx, gy, s.sz, 0, Math.PI * 2); ctx.fill();
            });
        }

        animationId = requestAnimationFrame(draw);
    }

    // ═══════════════════════════════════════════════════════════
    // OBSERVADORES E EVENTOS
    // ═══════════════════════════════════════════════════════════
    new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (visible && !animationId) animationId = requestAnimationFrame(draw);
    }, { threshold: .01 }).observe(section);

    section.addEventListener("mousemove", e => {
        mouseX = (e.clientX / innerWidth  - .5);
        mouseY = (e.clientY / innerHeight - .5);
        const r = canvas.getBoundingClientRect();
        mouseCanvasX = (e.clientX - r.left) * (canvas.width  / r.width);
        mouseCanvasY = (e.clientY - r.top)  * (canvas.height / r.height);
    }, { passive: true });

    section.addEventListener("mouseleave", () => {
        mouseCanvasX = -9999; mouseCanvasY = -9999;
    }, { passive: true });

    addEventListener("resize", resize, { passive: true });
    resize();
}

/**
 * ==========================================================================
 * FASE 2: DETECÇÃO DE SCROLL (REVEAL ON SCROLL) VIA INTERSECTION OBSERVER
 * ==========================================================================
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal");
    const projectReveals = document.querySelectorAll(".reveal-fade, .reveal-left, .reveal-right");

    const observerOptions = {
        root: null,
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains("reveal")) {
                    entry.target.classList.add("reveal-visible");
                } else {
                    entry.target.classList.add("active-reveal");
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        observer.observe(element);
    });
    projectReveals.forEach(element => {
        observer.observe(element);
    });
}

/**
 * ==========================================================================
 * FASE 2: LINHA DE TIMELINE DINÂMICA (SCROLL-PROGRESS) & ATIVAÇÃO DE ITENS
 * ==========================================================================
 */
function initTimelineProgress() {
    const aboutSection = document.getElementById("about-section");
    const aboutHeader = document.querySelector(".about-header");
    const timelineItems = document.querySelectorAll(".timeline-item");
    if (!aboutSection || !aboutHeader || !timelineItems.length) return;
    const chapterAt = [.52, .28, .40, .64, .76];

    function updateTimeline() {
        const rect = aboutSection.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, aboutSection.offsetHeight - innerHeight)));
        aboutHeader.classList.remove("cinematic-visible");
        timelineItems.forEach((item, index) => item.classList.toggle("active", Math.abs(progress - chapterAt[index]) < .055));
    }

    window.addEventListener("scroll", updateTimeline, { passive: true });
    window.addEventListener("resize", updateTimeline, { passive: true });
    if (window.gsap && window.ScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger);
        window.ScrollTrigger.create({
            trigger: aboutSection,
            start: "top bottom",
            end: "bottom top",
            onUpdate: updateTimeline
        });
    }
    updateTimeline();
}

/**
 * ==========================================================================
 * ROTAÇÃO DINÂMICA DO SUBTÍTULO (INSPIRADO EM MONCY.DEV)
 * ==========================================================================
 */
function initSubtitleRotator() {
    const rotatorItems = document.querySelectorAll(".rotator-item");
    if (rotatorItems.length === 0) return;

    let currentIndex = 0;

    setInterval(() => {
        const currentItem = rotatorItems[currentIndex];
        currentItem.classList.remove("active");
        currentItem.classList.add("outgoing");

        currentIndex = (currentIndex + 1) % rotatorItems.length;
        const nextItem = rotatorItems[currentIndex];
        nextItem.classList.remove("outgoing");
        nextItem.classList.add("active");

        setTimeout(() => {
            rotatorItems.forEach((item, idx) => {
                if (idx !== currentIndex) {
                    item.classList.remove("outgoing");
                }
            });
        }, 600);
    }, 3000);
}

/**
 * ==========================================================================
 * FASE 3: SISTEMA DE SCROLLYTELLING 3D E CONSTELAÇÕES (JORNADA)
 * ==========================================================================
 */
function initJourneyScrollytelling() {
    const journeySection = document.getElementById("journey-section");
    const canvas = document.getElementById("journey-canvas");
    const slides = document.querySelectorAll(".journey-slide");

    if (!journeySection || !canvas || slides.length === 0) return;

    const ctx = canvas.getContext("2d");

    // Configurações 3D
    let bgStars = [];
    const maxDepth = 17500;
    const fov = 160;
    let currentCameraZ = 0;
    let targetCameraZ = 0;

    // Estado de visibilidade
    let isSectionVisible = false;
    let animationId = null;

    // Define as Constelações da Trajetória (Cores baseadas no Carmim #BA4651, cz com base na escala de 16000)
    const constellations = [
        {
            id: 1,
            cx: 260, cy: -60, cz: 7280, // Lado direito superior (Slide 1: 0.43 a 0.48)
            stars: [
                { x: 0, y: -40 }, { x: 40, y: 0 }, { x: 0, y: 40 }, { x: -40, y: 0 }, { x: 0, y: 0 }
            ],
            lines: [
                [0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [1, 4], [2, 4], [3, 4]
            ]
        },
        {
            id: 2,
            cx: -260, cy: 30, cz: 8080, // Lado esquerdo inferior (Slide 2: 0.48 a 0.53)
            stars: [
                { x: -60, y: -30 }, { x: -20, y: -45 }, { x: 20, y: -15 }, { x: 40, y: 15 }, { x: 10, y: 45 }, { x: -30, y: 35 }
            ],
            lines: [
                [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]
            ]
        },
        {
            id: 3,
            cx: 240, cy: -85, cz: 8880, // Lado direito superior (Slide 3: 0.53 a 0.58)
            stars: [
                { x: 0, y: -50 }, { x: 45, y: 20 }, { x: -45, y: 20 }, { x: 0, y: 5 }
            ],
            lines: [
                [0, 1], [1, 2], [2, 0], [0, 3]
            ]
        },
        {
            id: 4,
            cx: -240, cy: -60, cz: 9680, // Lado esquerdo superior (Slide 4: 0.58 a 0.63)
            stars: [
                { x: 0, y: -50 }, { x: 40, y: 30 }, { x: -40, y: 30 }, { x: 0, y: 50 }, { x: -40, y: -30 }, { x: 40, y: -30 }
            ],
            lines: [
                [0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 3]
            ]
        },
        {
            id: 5,
            cx: 260, cy: 75, cz: 10480, // Lado direito inferior (Slide 5: 0.63 a 0.68)
            stars: [
                { x: 0, y: -45 }, { x: 40, y: -20 }, { x: 40, y: 20 }, { x: 0, y: 45 }, { x: -40, y: 20 }, { x: -40, y: -20 }
            ],
            lines: [
                [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]
            ]
        },
        {
            id: 6,
            cx: -260, cy: -80, cz: 11280, // Lado esquerdo superior (Slide 6: 0.68 a 0.73)
            stars: [
                { x: 0, y: -60 }, { x: 0, y: 60 }, { x: -45, y: 0 }, { x: 45, y: 0 }, { x: 0, y: 0 }
            ],
            lines: [
                [0, 1], [2, 3]
            ]
        },
        {
            id: 7, // Swarm do YuroBank
            isProject: true,
            cx: 260, cy: -60, cz: 13200, // (Slide YuroBank: 0.78 a 0.87 - Alinhado ao centro Z = 0.825 * 16000)
            color: '#8b5cf6',
            particleCount: 60
        },
        {
            id: 8, // Swarm do ShadowBloom
            isProject: true,
            cx: -260, cy: -80, cz: 14640, // (Slide ShadowBloom: 0.87 a 0.96 - Alinhado ao centro Z = 0.915 * 16000)
            color: '#BA4651',
            particleCount: 60
        }
    ];

    // Define os limites dos segmentos de scroll (Dedicados 22% iniciais apenas à exploração contemplativa profunda)
    const S_RANGES = [
        { start: 0.22, end: 0.29, id: 'journey-phrase-1' },
        { start: 0.29, end: 0.36, id: 'journey-phrase-2' },
        { start: 0.36, end: 0.43, id: 'journey-intro' },
        { start: 0.43, end: 0.48, id: 'journey-slide-1' },
        { start: 0.48, end: 0.53, id: 'journey-slide-2' },
        { start: 0.53, end: 0.58, id: 'journey-slide-3' },
        { start: 0.58, end: 0.63, id: 'journey-slide-4' },
        { start: 0.63, end: 0.68, id: 'journey-slide-5' },
        { start: 0.68, end: 0.73, id: 'journey-slide-6' },
        { start: 0.73, end: 0.78, id: 'journey-bridge' }, // Reduzido de 8% para 5% para dar respiro aos projetos
        { start: 0.78, end: 0.87, id: 'journey-project-yurobank' }, // Expandido de 6% para 9% (+50% tempo de foco)
        { start: 0.87, end: 0.96, id: 'journey-project-shadowbloom' }, // Expandido de 6% para 9% (+50% tempo de foco)
        { start: 0.96, end: 1.00, id: 'journey-outro' } // Reduzido de 7% para 4%
    ];

    // Redimensionamento do canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Inicializa estrelas 3D de fundo (Camadas, tamanhos e cores estelares proporcionalmente distribuídas - 1200 estrelas)
    function initBgStars() {
        bgStars = [];
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        // Camada 1: Estrelas extremamente distantes (700 estrelas)
        for (let i = 0; i < 700; i++) {
            const z = Math.random() * 9500 + 8000; // z = 8000 a 17500
            const limitX = cx * (z / fov);
            const limitY = cy * (z / fov);
            bgStars.push({
                layer: 1,
                x: (Math.random() - 0.5) * 2 * limitX,
                y: (Math.random() - 0.5) * 2 * limitY,
                z: z,
                size: Math.random() * 0.45 + 0.35, // 0.35px a 0.8px
                color: '#ffffff',
                baseAlpha: Math.random() * 0.25 + 0.1 // 0.1 a 0.35
            });
        }
        // Camada 2: Estrelas médias (400 estrelas)
        for (let i = 0; i < 400; i++) {
            const z = Math.random() * 4000 + 4000; // z = 4000 a 8000
            const limitX = cx * (z / fov);
            const limitY = cy * (z / fov);
            bgStars.push({
                layer: 2,
                x: (Math.random() - 0.5) * 2 * limitX,
                y: (Math.random() - 0.5) * 2 * limitY,
                z: z,
                size: Math.random() * 0.7 + 0.7, // 0.7px a 1.4px
                color: Math.random() < 0.85 ? '#ffffff' : '#a78bfa',
                baseAlpha: Math.random() * 0.3 + 0.3
            });
        }
        // Camada 3: Poucas estrelas próximas (80 estrelas)
        for (let i = 0; i < 80; i++) {
            const z = Math.random() * 3500 + 500; // z = 500 a 4000
            const limitX = cx * (z / fov);
            const limitY = cy * (z / fov);
            bgStars.push({
                layer: 3,
                x: (Math.random() - 0.5) * 2 * limitX,
                y: (Math.random() - 0.5) * 2 * limitY,
                z: z,
                size: Math.random() * 1.0 + 1.3, // 1.3px a 2.3px
                color: Math.random() < 0.8 ? '#ffffff' : '#d86c78',
                baseAlpha: Math.random() * 0.3 + 0.5
            });
        }
        // Camada 4: Partículas de poeira cósmica flutuantes (20 partículas de close-up)
        for (let i = 0; i < 20; i++) {
            bgStars.push({
                layer: 4,
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                z: 0,
                size: Math.random() * 6 + 4, // 4px a 10px
                vx: (Math.random() - 0.5) * 0.12,
                vy: (Math.random() - 0.5) * 0.12,
                color: Math.random() < 0.7 ? 'rgba(216, 108, 120, 0.13)' : 'rgba(167, 139, 250, 0.1)'
            });
        }
    }

    const techSection = document.getElementById("tech-stack");
    const techTransitionOverlay = document.getElementById("tech-transition-overlay");
    const techContainer = techSection ? techSection.querySelector(".tech-container") : null;
    const techTitle = techContainer ? techContainer.querySelector(".tech-title") : null;
    const techSubtitle = techContainer ? techContainer.querySelector(".tech-subtitle") : null;
    const techConstellation = document.getElementById("tech-constellation");
    const techNebulaContainer = document.getElementById("tech-nebula-container");


    function updateScroll() {
        const rect = journeySection.getBoundingClientRect();
        const scrollTrack = journeySection.offsetHeight - window.innerHeight;

        let progress = -rect.top / scrollTrack;
        progress = Math.max(0, Math.min(1, progress));

        techProgress = 0;
        if (techSection) {
            const techRect = techSection.getBoundingClientRect();
            const techTrack = techSection.offsetHeight - window.innerHeight;
            if (techTrack > 0) {
                techProgress = -techRect.top / techTrack;
                techProgress = Math.max(0, Math.min(1, techProgress));
            }
        }

        if (techProgress > 0) {
            targetCameraZ = 16000 + techProgress * 4000;
        } else {
            targetCameraZ = progress * 16000;
        }

        let activeId = '';
        for (const r of S_RANGES) {
            if (progress >= r.start && progress <= r.end) {
                activeId = r.id;
                break;
            }
        }

        let yuroSub = 0;
        if (progress >= 0.78 && progress <= 0.87) {
            const rel = (progress - 0.78) / 0.09;
            if (rel < 0.20) {
                yuroSub = rel / 0.20; // Entrada suave (primeiros 20% do scroll)
            } else if (rel < 0.80) {
                yuroSub = 1.0;        // Destaque fixo prolongado (60% do scroll)
            } else {
                yuroSub = 1.0 - (rel - 0.80) / 0.20; // Saída suave (últimos 20% do scroll)
            }
        } else if (progress > 0.87) {
            yuroSub = 0;
        }

        let shadowSub = 0;
        if (progress >= 0.87 && progress <= 0.96) {
            const rel = (progress - 0.87) / 0.09;
            if (rel < 0.20) {
                shadowSub = rel / 0.20; // Entrada suave (primeiros 20% do scroll)
            } else if (rel < 0.80) {
                shadowSub = 1.0;        // Destaque fixo prolongado (60% do scroll)
            } else {
                shadowSub = 1.0 - (rel - 0.80) / 0.20; // Saída suave (últimos 20% do scroll)
            }
        } else if (progress > 0.96) {
            shadowSub = 0;
        }

        const yuroSlide = document.getElementById("journey-project-yurobank");
        if (yuroSlide) {
            yuroSlide.style.setProperty("--reveal-progress", yuroSub);
            if (progress >= 0.78 && progress <= 0.87) {
                yuroSlide.classList.add("incoming");
            } else {
                yuroSlide.classList.remove("incoming");
            }
        }

        const shadowSlide = document.getElementById("journey-project-shadowbloom");
        if (shadowSlide) {
            shadowSlide.style.setProperty("--reveal-progress", shadowSub);
            if (progress >= 0.87 && progress <= 0.96) {
                shadowSlide.classList.add("incoming");
            } else {
                shadowSlide.classList.remove("incoming");
            }
        }

        if (techSection) {
            let bgOpacity = 0;
            if (techProgress < 0.75) {
                bgOpacity = Math.max(0, Math.min(0.9, techProgress * 4.0));
            } else {
                bgOpacity = Math.max(0, 0.9 * (1.0 - (techProgress - 0.75) / 0.23));
            }
            techSection.style.setProperty("--bg-opacity", bgOpacity);

            if (techNebulaContainer) {
                let nebulaOpacity = 0;
                if (techProgress >= 0.10 && techProgress <= 0.75) {
                    nebulaOpacity = Math.min(1.0, (techProgress - 0.10) / 0.50);
                } else if (techProgress > 0.75) {
                    nebulaOpacity = Math.max(0, 1.0 - (techProgress - 0.75) / 0.23);
                }
                techNebulaContainer.style.opacity = nebulaOpacity;
            }

            if (techTransitionOverlay) {
                if (techProgress > 0.05 && techProgress < 0.45) {
                    techTransitionOverlay.style.display = "flex";

                    let phraseOpacity = 0;
                    let phraseBlur = 12;
                    if (techProgress >= 0.05 && techProgress < 0.15) {
                        const f = (techProgress - 0.05) / 0.10;
                        phraseOpacity = f;
                        phraseBlur = 12 * (1 - f);
                    } else if (techProgress >= 0.15 && techProgress < 0.35) {
                        phraseOpacity = 1;
                        phraseBlur = 0;
                    } else if (techProgress >= 0.35 && techProgress < 0.45) {
                        const f = (techProgress - 0.35) / 0.10;
                        phraseOpacity = 1 - f;
                        phraseBlur = 12 * f;
                    }

                    techTransitionOverlay.style.opacity = phraseOpacity;
                    const pEl = techTransitionOverlay.querySelector(".tech-transition-phrase");
                    if (pEl) pEl.style.filter = `blur(${phraseBlur}px)`;
                } else {
                    techTransitionOverlay.style.display = "none";
                    techTransitionOverlay.style.opacity = "0";
                }
            }

            if (techTitle) {
                let titleOpacity = 0;
                let titleBlur = 15;
                let titleTranslate = 20;

                if (techProgress >= 0.48) {
                    if (techProgress < 0.58) {
                        const f = (techProgress - 0.48) / 0.10;
                        titleOpacity = f;
                        titleBlur = 15 * (1 - f);
                        titleTranslate = 20 * (1 - f);
                    } else if (techProgress <= 0.88) {
                        titleOpacity = 1;
                        titleBlur = 0;
                        titleTranslate = 0;
                    } else if (techProgress < 0.98) {
                        const f = (techProgress - 0.88) / 0.10;
                        titleOpacity = 1 - f;
                        titleBlur = 15 * f;
                        titleTranslate = -20 * f;
                    } else {
                        titleOpacity = 0;
                        titleBlur = 15;
                        titleTranslate = -20;
                    }
                }

                techTitle.style.opacity = titleOpacity;
                techTitle.style.filter = `blur(${titleBlur}px)`;
                techTitle.style.transform = `translateY(${titleTranslate}px)`;
            }

            if (techSubtitle) {
                let subOpacity = 0;
                let subBlur = 10;

                if (techProgress >= 0.52) {
                    if (techProgress < 0.62) {
                        const f = (techProgress - 0.52) / 0.10;
                        subOpacity = f;
                        subBlur = 10 * (1 - f);
                    } else if (techProgress <= 0.88) {
                        subOpacity = 1;
                        subBlur = 0;
                    } else if (techProgress < 0.98) {
                        const f = (techProgress - 0.88) / 0.10;
                        subOpacity = 1 - f;
                        subBlur = 10 * f;
                    } else {
                        subOpacity = 0;
                        subBlur = 10;
                    }
                }

                techSubtitle.style.opacity = subOpacity;
                techSubtitle.style.filter = `blur(${subBlur}px)`;
            }

            if (techConstellation) {
                let constOpacity = 0;
                let constBlur = 6;
                let constScale = 0.90;

                if (techProgress >= 0.45) {
                    if (techProgress < 0.58) {
                        const f = (techProgress - 0.45) / 0.13;
                        constOpacity = f;
                        constBlur = 6 * (1 - f);
                        constScale = 0.90 + 0.10 * f;
                    } else if (techProgress <= 0.88) {
                        constOpacity = 1.0;
                        constBlur = 0;
                        constScale = 1.0;
                    } else if (techProgress < 0.98) {
                        const f = (techProgress - 0.88) / 0.10;
                        constOpacity = 1.0 - f;
                        constBlur = 6 * f;
                        constScale = 1.0 - 0.10 * f;
                    } else {
                        constOpacity = 0;
                        constBlur = 6;
                        constScale = 0.90;
                    }
                }

                techConstellation.style.opacity = constOpacity;
                techConstellation.style.filter = `blur(${constBlur}px)`;
                techConstellation.style.transform = `scale(${constScale})`;
            }
        }

        const jRect = journeySection.getBoundingClientRect();
        if (jRect.top > window.innerHeight || jRect.bottom < 0) {
            slides.forEach(slide => {
                slide.classList.remove("active");
                slide.classList.remove("outgoing");
                slide.classList.remove("incoming");
                const m = slide.querySelector(".project-mockups");
                if (m) m.style.transform = "";
            });
            if (jRect.bottom < 0 && (!techSection || techSection.getBoundingClientRect().bottom < 0)) {
                return;
            }
        }

        slides.forEach(slide => {
            if (slide.id === activeId) {
                slide.classList.add("active");
                slide.classList.remove("outgoing");
            } else {
                if (slide.classList.contains("active")) {
                    slide.classList.remove("active");
                    slide.classList.add("outgoing");
                    const m = slide.querySelector(".project-mockups");
                    if (m) m.style.transform = "";
                } else {
                    slide.classList.remove("outgoing");
                }
            }
        });
    }

    function animate() {
        if (!isSectionVisible) {
            animationId = null;
            return;
        }

        currentCameraZ += (targetCameraZ - currentCameraZ) * 0.08;

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const scrollProgress = currentCameraZ / 16000;

        const camOffsetX = Math.sin(currentCameraZ / 1500) * 160;
        const camOffsetY = Math.cos(currentCameraZ / 2000) * 90;

        // 1. Renderiza e atualiza estrelas de fundo (Surgimento e aproximação progressivos baseados no scroll com micro-cruise drift passivo)
        bgStars.forEach((star, starIdx) => {
            const densityFactor = 0.15 + Math.min(0.85, scrollProgress / 0.35);
            const sizeMultiplier = 0.75 + 0.25 * densityFactor;

            // Filtra as estrelas ativas para criar o efeito de aproximação gradual de camadas
            if (star.layer === 2) {
                const relIdx = starIdx - 700;
                if (relIdx > densityFactor * 400) return;
            } else if (star.layer === 3) {
                const relIdx = starIdx - 1100;
                if (relIdx > densityFactor * 80) return;
            } else if (star.layer === 4) {
                const relIdx = starIdx - 1180;
                if (relIdx > densityFactor * 20) return;
            }

            if (star.layer === 4) {
                // Camada 4: Poeira cósmica 2D flutuante lenta (Close-up)
                star.x += star.vx;
                star.y += star.vy;

                if (star.x < -100) star.x = canvas.width + 100;
                if (star.x > canvas.width + 100) star.x = -100;
                if (star.y < -100) star.y = canvas.height + 100;
                if (star.y > canvas.height + 100) star.y = -100;

                const px = star.x;
                const py = star.y;
                const size = star.size * sizeMultiplier;

                const grad = ctx.createRadialGradient(px, py, 0, px, py, size);
                grad.addColorStop(0, star.color);
                grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = grad;
                ctx.globalAlpha = 0.9 * (0.35 + 0.65 * densityFactor);
                ctx.beginPath();
                ctx.arc(px, py, size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;
            } else {
                // Camadas 1, 2, 3: Estrelas 3D projetadas com efeito de paralaxe
                star.z -= 0.65;

                if (star.z - currentCameraZ <= 10) {
                    star.z = currentCameraZ + maxDepth;
                    const limitX = cx * (star.z / fov);
                    const limitY = cy * (star.z / fov);
                    star.x = (Math.random() - 0.5) * 2 * limitX;
                    star.y = (Math.random() - 0.5) * 2 * limitY;
                }

                const pz = star.z - currentCameraZ;
                const px = ((star.x - camOffsetX) * fov) / pz + cx;
                const py = ((star.y - camOffsetY) * fov) / pz + cy;

                if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
                    let alpha = star.baseAlpha * (0.45 + 0.55 * densityFactor);
                    if (pz < 400) {
                        alpha *= (pz / 400);
                    }

                    ctx.fillStyle = star.color;
                    ctx.globalAlpha = alpha;
                    ctx.fillRect(px, py, star.size * sizeMultiplier, star.size * sizeMultiplier);
                    ctx.globalAlpha = 1.0;
                }
            }
        });

        if (techProgress > 0.05 && techProgress < 0.85) {
            const techFade = Math.sin(techProgress * Math.PI);
            for (let i = 0; i < 8; i++) {
                const t = performance.now() * 0.0003 + i * 500;
                const px = (Math.sin(t * 0.7) * 0.4 + 0.5) * canvas.width;
                const py = (Math.cos(t * 0.5) * 0.4 + 0.5) * canvas.height;
                const size = (Math.sin(t * 0.3) * 30 + 70);

                const grad = ctx.createRadialGradient(px, py, 0, px, py, size);
                grad.addColorStop(0, `rgba(139, 92, 246, ${0.12 * techFade})`);
                grad.addColorStop(0.5, `rgba(29, 78, 216, ${0.04 * techFade})`);
                grad.addColorStop(1, "rgba(0, 0, 0, 0)");

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(px, py, size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        constellations.forEach((c, idx) => {
            let cz_projected = c.cz - currentCameraZ;

            if (scrollProgress >= 0.98 && !c.isProject) {
                cz_projected = 2500 + (idx * 300);
            }

            if (cz_projected <= 5) return;

            let starOpacity = 0;
            let lineOpacity = 0;
            let lineProgress = 0;

            if (scrollProgress >= 0.98) {
                const techFadeOut = techProgress > 0 ? Math.max(0, 1 - techProgress * 2.5) : 1.0;
                starOpacity = 0.45 * techFadeOut;
                lineOpacity = 0.12 * techFadeOut;
                lineProgress = 1.0;
            } else {
                const dist = c.cz - currentCameraZ;

                if (dist > 0 && dist < 3000) {
                    starOpacity = 1 - dist / 3000;
                }

                // Encontra a faixa do slide correspondente a esta constelação/projeto
                let S_start = 0;
                let S_end = 0;
                if (c.isProject) {
                    const range = S_RANGES.find(r => r.id === (c.id === 7 ? 'journey-project-yurobank' : 'journey-project-shadowbloom'));
                    if (range) {
                        S_start = range.start;
                        S_end = range.end;
                    }
                } else {
                    const range = S_RANGES.find(r => r.id === `journey-slide-${c.id}`);
                    if (range) {
                        S_start = range.start;
                        S_end = range.end;
                    }
                }

                if (scrollProgress >= S_start && scrollProgress <= S_end) {
                    starOpacity = 1.0;
                    const segProgress = (scrollProgress - S_start) / (S_end - S_start);

                    if (segProgress >= 0.2 && segProgress < 0.6) {
                        lineProgress = (segProgress - 0.2) / 0.4;
                        lineOpacity = 0.65;
                    } else if (segProgress >= 0.6) {
                        lineProgress = 1.0;
                        lineOpacity = 0.65;
                    }
                } else if (scrollProgress > S_end) {
                    if (dist > 0) {
                        starOpacity = 1.0;
                        lineProgress = 1.0;
                        lineOpacity = Math.max(0, 0.65 - (scrollProgress - S_end) / 0.02);
                    }
                }
            }

            if (starOpacity <= 0) return;

            if (c.isProject) {
                let swarmOpacity = 0;
                const dist = Math.abs(c.cz - currentCameraZ);
                if (dist < 5000) {
                    swarmOpacity = (1 - dist / 5000) * starOpacity;
                }

                if (swarmOpacity > 0) {
                    if (!c.particles) {
                        c.particles = [];
                        for (let i = 0; i < c.particleCount; i++) {
                            c.particles.push({
                                angle: Math.random() * Math.PI * 2,
                                radius: 35 + Math.random() * 50,
                                speed: 0.005 + Math.random() * 0.015,
                                size: Math.random() * 1.5 + 0.8
                            });
                        }
                    }

                    c.particles.forEach(p => {
                        p.angle += p.speed;
                        const sx = c.cx + Math.cos(p.angle) * p.radius - camOffsetX;
                        const sy = c.cy + Math.sin(p.angle) * p.radius - camOffsetY;

                        const px = (sx * fov) / cz_projected + cx;
                        const py = (sy * fov) / cz_projected + cy;

                        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
                            ctx.fillStyle = c.color;
                            ctx.globalAlpha = swarmOpacity * 0.6;
                            ctx.fillRect(px, py, p.size, p.size);
                            ctx.globalAlpha = 1.0;
                        }
                    });
                }
            } else {
                const projectedStars = c.stars.map(s => {
                    const x = c.cx + s.x - camOffsetX;
                    const y = c.cy + s.y - camOffsetY;
                    return {
                        x: (x * fov) / cz_projected + cx,
                        y: (y * fov) / cz_projected + cy
                    };
                });

                if (lineOpacity > 0 && lineProgress > 0) {
                    c.lines.forEach(line => {
                        const p1 = projectedStars[line[0]];
                        const p2 = projectedStars[line[1]];

                        const targetX = p1.x + (p2.x - p1.x) * lineProgress;
                        const targetY = p1.y + (p2.y - p1.y) * lineProgress;

                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(targetX, targetY);
                        ctx.strokeStyle = `rgba(186, 70, 81, ${lineOpacity.toFixed(3)})`;
                        ctx.lineWidth = 1.1;
                        ctx.shadowBlur = 0;
                        ctx.stroke();
                    });
                }

                projectedStars.forEach(p => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${starOpacity.toFixed(3)})`;
                    ctx.shadowColor = `rgba(186, 70, 81, ${starOpacity.toFixed(3)})`;
                    ctx.shadowBlur = 8;
                    ctx.fill();
                });
            }
        });

        animationId = requestAnimationFrame(animate);
    }

    let isJourneyVisible = false;
    let isTechVisible = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.target === journeySection) {
                isJourneyVisible = entry.isIntersecting;
            } else if (entry.target === techSection) {
                isTechVisible = entry.isIntersecting;
            }

            isSectionVisible = isJourneyVisible || isTechVisible;

            if (isSectionVisible) {
                if (!animationId) {
                    animate();
                }
            } else {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
        });
    }, { threshold: 0.01 });

    observer.observe(journeySection);
    if (techSection) {
        observer.observe(techSection);
    }

    window.addEventListener("resize", () => {
        resizeCanvas();
        initBgStars();
    });
    window.addEventListener("scroll", updateScroll, { passive: true });

    resizeCanvas();
    initBgStars();
    updateScroll();
}

/**
 * ==========================================================================
 * FASE 5: TECNOLOGIAS (CONSTELAÇÃO VIVA COM FÍSICA DE AGRUPAMENTO)
 * ==========================================================================
 */
function initTechStackPhysics() {
    const container = document.getElementById("tech-constellation");
    if (!container) return;

    const stars = Array.from(container.querySelectorAll(".tech-star"));
    if (stars.length === 0) return;

    // Canvas de Fundo para os Poros Estelares e Poeira Cósmica
    const bgCanvas = document.getElementById("tech-bg-canvas");
    let bgCtx = null;
    if (bgCanvas) {
        bgCtx = bgCanvas.getContext("2d");
        bgCanvas.width = Math.max(300, bgCanvas.clientWidth || window.innerWidth || 1920);
        bgCanvas.height = Math.max(300, bgCanvas.clientHeight || window.innerHeight || 1080);
    }

    // Poeira cósmica delicada para a transição cinematográfica da frase
    const phraseDust = [];
    for (let i = 0; i < 45; i++) {
        phraseDust.push({
            x: Math.random(),
            y: Math.random(),
            size: Math.random() * 1.5 + 0.6,
            alpha: Math.random() * 0.5 + 0.2,
            speed: 0.00015 + Math.random() * 0.0003,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: 0.01 + Math.random() * 0.02
        });
    }

    // Poros estelares / Stardust minimalista (efeito via láctea sutil de fundo)
    const stellarPores = [];
    const poreCount = 800; // Alta densidade de micro-pontos para simular porosidade estelar
    const initWidth = Math.max(300, container.clientWidth || window.innerWidth || 1920);
    const initHeight = Math.max(300, container.clientHeight || window.innerHeight || 1080);
    for (let i = 0; i < poreCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distPct = Math.pow(Math.random(), 1.6);
        const maxRadius = Math.max(initWidth, initHeight) * 0.85;
        const radius = distPct * maxRadius;

        stellarPores.push({
            rx: 0.5 + Math.cos(angle) * (radius / initWidth) + (Math.random() - 0.5) * 0.1,
            ry: 0.5 + Math.sin(angle) * (radius / initHeight) + (Math.random() - 0.5) * 0.1,
            size: Math.random() * 0.70 + 0.15, // Ultra pequenos: 0.15px a 0.85px
            alpha: Math.random() * 0.14 + 0.02, // Extremamente sutil (opacidade máxima 0.16)
            color: Math.random() < 0.70
                ? "255, 255, 255" // Branco estelar
                : (Math.random() < 0.5 ? "167, 139, 250" : "246, 76, 68"), // Violeta ou Coral
            pulseSpeed: Math.random() * 0.003 + 0.001,
            pulsePhase: Math.random() * Math.PI * 2
        });
    }

    // Configurações Físicas
    const RADIUS = 60; // Reduzido de 80 para 60 para esferas mais discretas e elegantes
    const COLLISION_DIST = RADIUS * 2;
    const BASE_GRAVITY = 0.008;
    const HOVER_GRAVITY = 0.0001;
    const BASE_FRICTION = 0.70;
    const HOVER_FRICTION = 0.96;
    const REPULSION_RADIUS = 130; // Ajustado proporcionalmente
    const REPULSION_FORCE = 18.0;

    let currentGravity = BASE_GRAVITY;
    let currentFriction = BASE_FRICTION;

    let mouseX = null;
    let mouseY = null;
    let isMouseIn = false;
    let mouseVx = 0;
    let mouseVy = 0;

    let width = window.innerWidth || 1920;
    let height = window.innerHeight || 1080;
    let centerX = width / 2;
    let centerY = height * 0.62;

    const particles = stars.map((element, idx) => {
        element.style.width = `${RADIUS * 2}px`;
        element.style.height = `${RADIUS * 2}px`;
        element.style.zIndex = "10";
        element.style.opacity = "1";
        element.style.filter = "none";

        const angle = (idx * Math.PI * 2) / stars.length;
        const dist = 60 + Math.random() * 80;
        const startX = centerX + Math.cos(angle) * dist - RADIUS;
        const startY = centerY + Math.sin(angle) * dist - RADIUS;

        return {
            element: element,
            radius: RADIUS,
            x: startX,
            y: startY,
            vx: 0,
            vy: 0,
            floatSeedX: Math.random() * 100,
            floatSeedY: Math.random() * 100,
            floatSpeed: 0.0006 + Math.random() * 0.001
        };
    });

    const section = document.getElementById("tech-stack") || container;

    section.addEventListener("mousemove", (e) => {
        const rect = container.getBoundingClientRect();
        const newMouseX = e.clientX - rect.left;
        const newMouseY = e.clientY - rect.top;

        if (mouseX !== null && mouseY !== null) {
            mouseVx = newMouseX - mouseX;
            mouseVy = newMouseY - mouseY;
        }

        mouseX = newMouseX;
        mouseY = newMouseY;
        isMouseIn = true;
    });

    section.addEventListener("mouseleave", () => {
        isMouseIn = false;
        mouseX = null;
        mouseY = null;
        mouseVx = 0;
        mouseVy = 0;
    });

    window.addEventListener("resize", () => {
        width = window.innerWidth || 1920;
        height = window.innerHeight || 1080;
        if (bgCanvas) {
            bgCanvas.width = bgCanvas.clientWidth || window.innerWidth || 1920;
            bgCanvas.height = bgCanvas.clientHeight || window.innerHeight || 1080;
        }
        const oldCenterX = centerX;
        const oldCenterY = centerY;
        centerX = width / 2;
        centerY = height * 0.62;

        if (oldCenterX === 0 && oldCenterY === 0 && centerX > 0) {
            particles.forEach((p, idx) => {
                const angle = (idx * Math.PI * 2) / particles.length;
                const dist = 60 + Math.random() * 80;
                p.x = centerX + Math.cos(angle) * dist - p.radius;
                p.y = centerY + Math.sin(angle) * dist - p.radius;
            });
        }
    });

    let lastTime = 0;
    function tick(time) {
        const currentTime = time || performance.now();
        const dt = lastTime === 0 ? 16 : Math.min(32, currentTime - lastTime);
        lastTime = currentTime;

        // 1. Limpar e desenhar o Canvas de Fundo (Poros Estelares e Nebulosa sutil)
        if (bgCanvas && bgCtx) {
            bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

            if (techProgress > 0) {
                const fade = Math.min(1.0, techProgress * 1.5);
                const sectionFade = Math.min(1.0, techProgress * 2.0) * Math.min(1.0, (1.0 - techProgress) * 4.0);

                const cx = bgCanvas.width / 2;
                const cy = bgCanvas.height / 2;

                // Radial gradient de fundo (Nebulosa sutil roxo/preto)
                const grad = bgCtx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(bgCanvas.width, bgCanvas.height));
                const r = Math.round(10 * fade);
                const g = Math.round(6 * fade);
                const b = Math.round(27 * fade);
                grad.addColorStop(0, `rgb(${r}, ${g}, ${b})`);
                grad.addColorStop(1, "#000000");
                bgCtx.fillStyle = grad;
                bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

                // Desenhar poros estelares
                stellarPores.forEach(p => {
                    p.pulsePhase += p.pulseSpeed;
                    const brightness = 0.6 + 0.4 * Math.sin(p.pulsePhase);
                    const currentAlpha = p.alpha * brightness * sectionFade;

                    if (currentAlpha > 0.005) {
                        const px = p.rx * bgCanvas.width;
                        const py = p.ry * bgCanvas.height;

                        bgCtx.fillStyle = `rgba(${p.color}, ${currentAlpha})`;
                        if (p.size > 0.5) {
                            bgCtx.beginPath();
                            bgCtx.arc(px, py, p.size, 0, Math.PI * 2);
                            bgCtx.fill();
                        } else {
                            bgCtx.fillRect(px, py, 1, 1);
                        }
                    }
                });

                // Desenhar phraseDust
                if (techProgress > 0.01 && techProgress < 0.48) {
                    const phraseFade = Math.min(1.0, (techProgress - 0.01) / 0.14) * Math.min(1.0, (0.48 - techProgress) / 0.10);

                    phraseDust.forEach(p => {
                        // Drift vertical baseado no delta time
                        p.y -= p.speed * (dt * 1.1);
                        if (p.y < 0) p.y = 1.0;

                        p.pulse += p.pulseSpeed;
                        const px = p.x * bgCanvas.width;
                        const py = p.y * bgCanvas.height;
                        const currentAlpha = p.alpha * (0.35 + 0.65 * Math.sin(p.pulse)) * phraseFade;

                        if (currentAlpha > 0.01) {
                            bgCtx.fillStyle = `rgba(167, 139, 250, ${currentAlpha * 0.45})`;
                            bgCtx.beginPath();
                            bgCtx.arc(px, py, p.size * 2.2, 0, Math.PI * 2);
                            bgCtx.fill();

                            bgCtx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
                            bgCtx.beginPath();
                            bgCtx.arc(px, py, p.size * 0.8, 0, Math.PI * 2);
                            bgCtx.fill();
                        }
                    });
                }
            }
        }

        mouseVx *= 0.85;
        mouseVy *= 0.85;

        const targetGravity = isMouseIn ? HOVER_GRAVITY : BASE_GRAVITY;
        currentGravity += (targetGravity - currentGravity) * 0.08;

        const targetFriction = isMouseIn ? HOVER_FRICTION : BASE_FRICTION;
        currentFriction += (targetFriction - currentFriction) * 0.08;

        particles.forEach(p => {
            p.floatSeedX += p.floatSpeed * 16;
            p.floatSeedY += p.floatSpeed * 16;

            const floatFX = Math.sin(p.floatSeedX) * 0.08;
            const floatFY = Math.cos(p.floatSeedY) * 0.08;

            let ax = floatFX;
            let ay = floatFY;

            const targetX = centerX - p.radius;
            const targetY = centerY - p.radius;

            ax += (targetX - p.x) * currentGravity;
            ay += (targetY - p.y) * currentGravity;

            if (isMouseIn && mouseX !== null && mouseY !== null) {
                const px = p.x + p.radius;
                const py = p.y + p.radius;

                const dx = px - mouseX;
                const dy = py - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < REPULSION_RADIUS && dist > 5) {
                    const pct = 1 - (dist / REPULSION_RADIUS);
                    const push = pct * REPULSION_FORCE;

                    p.vx += (dx / dist) * push * 0.25;
                    p.vy += (dy / dist) * push * 0.25;

                    const mouseSpeed = Math.sqrt(mouseVx * mouseVx + mouseVy * mouseVy);
                    if (mouseSpeed > 1) {
                        p.vx += mouseVx * pct * 0.45;
                        p.vy += mouseVy * pct * 0.45;
                    }
                }
            }

            p.vx = (p.vx + ax) * currentFriction;
            p.vy = (p.vy + ay) * currentFriction;

            p.x += p.vx;
            p.y += p.vy;
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];

                const collisionDist = p1.radius + p2.radius;

                const cx1 = p1.x + p1.radius;
                const cy1 = p1.y + p1.radius;
                const cx2 = p2.x + p2.radius;
                const cy2 = p2.y + p2.radius;

                const dx = cx2 - cx1;
                const dy = cy2 - cy1;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < collisionDist) {
                    const overlap = collisionDist - dist;
                    const ndx = dx / (dist || 1);
                    const ndy = dy / (dist || 1);

                    p1.x -= ndx * overlap * 0.15;
                    p1.y -= ndy * overlap * 0.15;
                    p2.x += ndx * overlap * 0.15;
                    p2.y += ndy * overlap * 0.15;

                    const rvx = p2.vx - p1.vx;
                    const rvy = p2.vy - p1.vy;

                    const velAlongNormal = rvx * ndx + rvy * ndy;

                    if (velAlongNormal < 0) {
                        const restitution = 0.55;
                        const impulseScalar = -(1 + restitution) * velAlongNormal / 2;

                        p1.vx -= ndx * impulseScalar;
                        p1.vy -= ndy * impulseScalar;
                        p2.vx += ndx * impulseScalar;
                        p2.vy += ndy * impulseScalar;
                    }
                }
            }
        }

        particles.forEach(p => {
            const minX = -p.radius * 0.7;
            const maxX = width - p.radius * 1.3;
            const minY = height * 0.35;
            const maxY = height - p.radius * 1.3;

            if (p.x < minX) { p.x = minX; p.vx = -p.vx * 0.6; }
            if (p.x > maxX) { p.x = maxX; p.vx = -p.vx * 0.6; }
            if (p.y < minY) { p.y = minY; p.vy = -p.vy * 0.6; }
            if (p.y > maxY) { p.y = maxY; p.vy = -p.vy * 0.6; }

            p.element.style.left = `${p.x}px`;
            p.element.style.top = `${p.y}px`;
        });

        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}

/**
 * ==========================================================================
 * FASE 6: JORNADA TECNOLÓGICA CINEMATOGRÁFICA (HTML, CSS, JS)
 * ==========================================================================
 */
function initTechJourney() {
    const techJourney = document.getElementById("tech-journey");
    const canvas = document.getElementById("tech-journey-canvas");
    const nebula = techJourney ? techJourney.querySelector(".tech-journey-nebula") : null;

    if (!techJourney || !canvas) return;

    const ctx = canvas.getContext("2d");

    let width = canvas.width = canvas.clientWidth;
    let height = canvas.height = canvas.clientHeight;
    let centerX = width / 2;
    let centerY = height / 2;

    let journeyProgress = 0;
    let isVisible = false;
    let animationId = null;

    const fov = 400;
    let cameraZ = 0;
    let cameraOffsetX = 0;
    let cameraOffsetY = 0;
    let targetCameraOffsetX = 0;
    let targetCameraOffsetY = 0;
    let mouseX = width / 2;
    let mouseY = height / 2;

    // Lista de tecnologias contendo Antigravity entre GitHub e ChatGPT com Z-depths recalculados
    const floatingTexts = [
        { title: "HTML", desc: "A fundação da jornada.", x: 0, y: -50, z: 650, color: "#f97316" },
        { title: "CSS", desc: "Onde a estrutura ganha forma.", x: 0, y: -50, z: 1250, color: "#38bdf8" },
        { title: "JavaScript", desc: "Onde tudo ganha vida.", x: 0, y: -50, z: 1850, color: "#facc15" },
        { title: "Git", desc: "Ramificações e evolução.", x: 0, y: -50, z: 2450, color: "#f43f5e" },
        { title: "GitHub", desc: "Colaboração e ecossistema.", x: 0, y: -50, z: 3050, color: "#cbd5e1" },
        { title: "Antigravity", desc: "Transformando ideias em experiências visuais.", x: 0, y: -50, z: 3650, color: "#F64C44" },
        { title: "ChatGPT", desc: "Conhecimento e aprendizado.", x: 0, y: -50, z: 4250, color: "#34d399" },
        { title: "Gemini", desc: "Exploração e possibilidades.", x: 0, y: -50, z: 4850, color: "#c084fc" }
    ];

    // HTML (z: 300 a 900)
    const htmlLines = [];
    for (let z = 300; z <= 900; z += 120) {
        htmlLines.push({ p1: { x: -300, y: -180, z }, p2: { x: 300, y: -180, z } });
        htmlLines.push({ p1: { x: 300, y: -180, z }, p2: { x: 300, y: 180, z } });
        htmlLines.push({ p1: { x: 300, y: 180, z }, p2: { x: -300, y: 180, z } });
        htmlLines.push({ p1: { x: -300, y: 180, z }, p2: { x: -300, y: -180, z } });
    }
    for (let x of [-300, 300]) {
        for (let y of [-180, 180]) {
            htmlLines.push({ p1: { x, y, z: 300 }, p2: { x, y, z: 900 } });
        }
    }

    // CSS (z: 900 a 1500)
    const cssLines = [];
    for (let z = 900; z <= 1500; z += 120) {
        cssLines.push({ p1: { x: -250, y: -160, z }, p2: { x: 250, y: -160, z } });
        cssLines.push({ p1: { x: 250, y: -160, z }, p2: { x: 250, y: 160, z } });
        cssLines.push({ p1: { x: 250, y: 160, z }, p2: { x: -250, y: 160, z } });
        cssLines.push({ p1: { x: -250, y: 160, z }, p2: { x: -250, y: -160, z } });
    }
    for (let x of [-250, 250]) {
        for (let y of [-160, 160]) {
            cssLines.push({ p1: { x, y, z: 900 }, p2: { x, y, z: 1500 } });
        }
    }

    // JS (z: 1500 a 2100)
    const jsNodes3D = [];
    for (let i = 0; i < 45; i++) {
        jsNodes3D.push({
            x: (Math.random() - 0.5) * 700,
            y: (Math.random() - 0.5) * 450,
            z: 1500 + Math.random() * 600,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            radius: Math.random() * 3 + 2.5
        });
    }

    // Git (z: 2100 a 2700)
    const gitLines = [];
    gitLines.push({ p1: { x: 0, y: 0, z: 2100 }, p2: { x: 0, y: 0, z: 2300 }, color: "#f43f5e" });
    gitLines.push({ p1: { x: 0, y: 0, z: 2300 }, p2: { x: -160, y: -60, z: 2500 }, color: "#fb7185" });
    gitLines.push({ p1: { x: 0, y: 0, z: 2300 }, p2: { x: 160, y: 60, z: 2500 }, color: "#f43f5e" });
    gitLines.push({ p1: { x: 0, y: 0, z: 2300 }, p2: { x: 0, y: 120, z: 2500 }, color: "#fda4af" });
    gitLines.push({ p1: { x: -160, y: -60, z: 2500 }, p2: { x: -260, y: -100, z: 2700 }, color: "#fb7185" });
    gitLines.push({ p1: { x: -160, y: -60, z: 2500 }, p2: { x: -80, y: -30, z: 2700 }, color: "#f43f5e" });
    gitLines.push({ p1: { x: 160, y: 60, z: 2500 }, p2: { x: 80, y: 30, z: 2700 }, color: "#fda4af" });
    gitLines.push({ p1: { x: 160, y: 60, z: 2500 }, p2: { x: 260, y: 100, z: 2700 }, color: "#fb7185" });

    // GitHub (z: 2700 a 3300)
    const ghNodes = [
        { x: -180, y: -80, z: 2750 }, { x: 180, y: 80, z: 2750 },
        { x: -60, y: 120, z: 2900 }, { x: 60, y: -120, z: 2900 },
        { x: -240, y: 60, z: 3100 }, { x: 240, y: -60, z: 3100 },
        { x: 0, y: 0, z: 3280 }
    ];
    const ghLines = [];
    for (let i = 0; i < ghNodes.length; i++) {
        for (let j = i + 1; j < ghNodes.length; j++) {
            const dz = Math.abs(ghNodes[i].z - ghNodes[j].z);
            if (dz < 350) {
                ghLines.push({ p1: ghNodes[i], p2: ghNodes[j] });
            }
        }
    }

    // Antigravity (z: 3300 a 3900)
    const antigravityPlanes = [];
    for (let i = 0; i < 4; i++) {
        antigravityPlanes.push({
            x: (i % 2 === 0 ? -170 : 170) + (Math.random() - 0.5) * 50,
            y: (i < 2 ? -95 : 95) + (Math.random() - 0.5) * 50,
            z: 3360 + i * 135,
            width: 150,
            height: 95,
            rotation: (Math.random() - 0.5) * 0.45,
            driftOffset: Math.random() * Math.PI * 2
        });
    }

    // ChatGPT (z: 3900 a 4500)
    const chatgptTracks = [];
    for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI * 2) / 4;
        const x = Math.cos(angle) * 140;
        const y = Math.sin(angle) * 140;
        chatgptTracks.push({
            p1: { x, y, z: 3900 },
            p2: { x, y, z: 4550 }
        });
    }
    const chatgptPackets = [];
    for (let i = 0; i < 50; i++) {
        chatgptPackets.push({
            trackIdx: i % chatgptTracks.length,
            progress: Math.random(),
            speed: 0.006 + Math.random() * 0.007,
            size: Math.random() * 2 + 1.2
        });
    }

    // Gemini (z: 4500 a 5200)
    const geminiVectors = [];
    for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        geminiVectors.push({
            p1: { x: Math.cos(angle) * 60, y: Math.sin(angle) * 60, z: 4550 },
            p2: { x: Math.cos(angle) * 1600, y: Math.sin(angle) * 1600, z: 5200 }
        });
    }
    const geminiRings = [];
    for (let z = 4600; z <= 5150; z += 110) {
        geminiRings.push({
            x: 0,
            y: 0,
            z: z,
            radius: 190 + (z - 4600) * 0.45
        });
    }

    // Motor de Partículas 3D: poeira cósmica, digital energy, vagalumes luminosos
    const cosmicParticles = [];
    const particleCount = 450;

    // Paleta unificada de alta fidelidade: Roxo/Violeta (65%), Coral/Antigravity (20%), Branco suave (15%)
    const particleColors = [
        "167, 139, 250", // Violeta
        "139, 92, 246",  // Roxo
        "246, 76, 68",   // Coral
        "255, 255, 255"  // Branco suave
    ];

    for (let i = 0; i < particleCount; i++) {
        const z = Math.random() * 5200;
        const angle = Math.random() * Math.PI * 2;

        // 3 Camadas de Parallax: 15% próximas/grandes, 55% intermediárias, 30% distantes/lentas
        let sizeVal = 0;
        let speedVal = 0;
        let distVal = 0;

        const rand = Math.random();
        if (rand < 0.15) {
            // Layer 1: Próximo da câmera (Vagalumes gigantes de close-up que passam voando rápido)
            sizeVal = Math.random() * 2.2 + 1.8; // 1.8px a 4px
            speedVal = 0.15 + Math.random() * 0.10;
            distVal = 120 + Math.random() * 220;
        } else if (rand < 0.70) {
            // Layer 2: Meio do túnel (Poeira normal de espaço)
            sizeVal = Math.random() * 1.1 + 0.6; // 0.6px a 1.7px
            speedVal = 0.06 + Math.random() * 0.04;
            distVal = 220 + Math.random() * 450;
        } else {
            // Layer 3: Fundo (Estrelas distantes pequeninas)
            sizeVal = Math.random() * 0.45 + 0.25; // 0.25px a 0.7px
            speedVal = 0.02 + Math.random() * 0.02;
            distVal = 10 + Math.random() * 180;
        }

        let color = "";
        const colRand = Math.random();
        if (colRand < 0.65) {
            color = particleColors[Math.random() < 0.5 ? 0 : 1]; // Roxo ou Violeta
        } else if (colRand < 0.85) {
            color = particleColors[2]; // Coral (Antigravity)
        } else {
            color = particleColors[3]; // Branco
        }

        cosmicParticles.push({
            x: Math.cos(angle) * distVal,
            y: Math.sin(angle) * distVal,
            z: z,
            size: sizeVal,
            speedVal: speedVal,
            isFirefly: Math.random() < 0.35, // 35% de vagalumes flutuantes
            pulseSpeed: 0.01 + Math.random() * 0.02,
            pulsePhase: Math.random() * Math.PI * 2,
            driftSpeedX: 0.4 + Math.random() * 0.6,
            driftSpeedY: 0.4 + Math.random() * 0.6,
            driftAmplitude: 4 + Math.random() * 8, // Flutuação tridimensional orgânica sutil
            color: color
        });
    }

    // Parâmetros do Túnel Wireframe Holográfico
    const tunnelRadius = 390;
    const numSectors = 8;
    const ringSpacing = 160;
    const maxZ = 5200;

    function getTunnelColor(z, alphaVal) {
        if (z < 900) return `rgba(249, 115, 22, ${alphaVal})`;      // HTML
        if (z < 1500) return `rgba(56, 189, 248, ${alphaVal})`;     // CSS
        if (z < 2100) return `rgba(250, 204, 21, ${alphaVal})`;     // JS
        if (z < 2700) return `rgba(244, 63, 94, ${alphaVal})`;      // Git
        if (z < 3300) return `rgba(255, 255, 255, ${alphaVal})`;    // GitHub
        if (z < 3900) return `rgba(246, 76, 68, ${alphaVal})`;      // Antigravity (coral)
        if (z < 4500) return `rgba(52, 211, 153, ${alphaVal})`;     // ChatGPT
        return `rgba(192, 132, 252, ${alphaVal})`;                  // Gemini
    }

    function resizeCanvas() {
        width = canvas.width = canvas.clientWidth;
        height = canvas.height = canvas.clientHeight;
        centerX = width / 2;
        centerY = height / 2;
    }

    function updateScroll() {
        const rect = techJourney.getBoundingClientRect();
        const scrollTrack = techJourney.offsetHeight - window.innerHeight;
        if (scrollTrack <= 0) return;

        let progress = -rect.top / scrollTrack;
        journeyProgress = Math.max(0, Math.min(1.0, progress));

        if (nebula) {
            let nebulaOpacity = 0;
            if (journeyProgress > 0.05 && journeyProgress < 0.95) {
                nebulaOpacity = Math.sin((journeyProgress - 0.05) / 0.9 * Math.PI) * 0.85;
            }
            nebula.style.opacity = nebulaOpacity;
        }
    }

    techJourney.addEventListener("mousemove", (e) => {
        const rect = techJourney.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;

        const relX = (mouseX / width) - 0.5;
        const relY = (mouseY / height) - 0.5;

        // Reduzido para uma reação extremamente minimalista e suave ao mouse
        targetCameraOffsetX = relX * 70;
        targetCameraOffsetY = relY * 50;
    });

    techJourney.addEventListener("mouseleave", () => {
        targetCameraOffsetX = 0;
        targetCameraOffsetY = 0;
    });

    function drawElectricity(x1, y1, x2, y2, opacity) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);

        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const segments = Math.max(3, Math.floor(dist / 25));
        const normalX = -dy / dist;
        const normalY = dx / dist;

        for (let i = 1; i < segments; i++) {
            const ratio = i / segments;
            const targetX = x1 + dx * ratio;
            const targetY = y1 + dy * ratio;

            const offset = (Math.random() - 0.5) * 12 * Math.sin(ratio * Math.PI);
            const nextX = targetX + normalX * offset;
            const nextY = targetY + normalY * offset;

            ctx.lineTo(nextX, nextY);
        }
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(167, 139, 250, ${opacity * 0.75})`;
        ctx.lineWidth = 1.0;
        ctx.shadowColor = `rgba(139, 92, 246, ${opacity})`;
        ctx.shadowBlur = 4;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    // Variáveis para rastrear velocidade do scroll e warp speed
    let prevJourneyProgress = 0;
    let scrollVelocity = 0;
    let smoothScrollVelocity = 0;
    let lastTime = 0;

    function animate(time) {
        if (!isVisible) {
            animationId = null;
            return;
        }

        ctx.clearRect(0, 0, width, height);

        // Calcula delta tempo para drift de partículas independente de framerate
        if (lastTime === 0) lastTime = time;
        const dt = Math.min(33, time - lastTime);
        lastTime = time;

        cameraOffsetX += (targetCameraOffsetX - cameraOffsetX) * 0.08;
        cameraOffsetY += (targetCameraOffsetY - cameraOffsetY) * 0.08;

        cameraZ = journeyProgress * 5200;

        let particlesOpacity = 1.0;
        if (journeyProgress < 0.18) {
            particlesOpacity = journeyProgress / 0.18;
        } else if (journeyProgress > 0.94) {
            particlesOpacity = (1.0 - journeyProgress) / 0.06;
        }

        let gridOpacity = 1.0;
        if (journeyProgress < 0.25) {
            gridOpacity = Math.max(0, (journeyProgress - 0.05) / 0.20);
        } else if (journeyProgress > 0.94) {
            gridOpacity = (1.0 - journeyProgress) / 0.06;
        }

        const sectionOpacity = gridOpacity; // Mapeado para os elementos estruturais e textos

        // Medição e interpolação da velocidade de rolagem para o efeito Wormhole
        scrollVelocity = Math.abs(journeyProgress - prevJourneyProgress);
        prevJourneyProgress = journeyProgress;
        smoothScrollVelocity += (scrollVelocity - smoothScrollVelocity) * 0.1;
        const warpFactor = Math.min(1.0, smoothScrollVelocity * 38);

        // Vortex roll: rotação de câmera tridimensional que reage ao scroll para dar efeito de redemoinho
        const cameraRoll = time * 0.00006 + smoothScrollVelocity * 0.68;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(cameraRoll);
        ctx.translate(-centerX, -centerY);

        // Função de curvatura tridimensional da dimensão tecnológica (curvatura da spline do túnel)
        function getPathOffset(z, timeVal) {
            const snakeX = Math.sin(z * 0.0012 + timeVal * 0.0009) * 85;
            const snakeY = Math.cos(z * 0.0008 + timeVal * 0.0007) * 60;
            return { x: snakeX, y: snakeY };
        }

        // Helper de projeção 3D unificado para aplicar a curvatura Snake Spline em tudo
        function project3D(x, y, z) {
            const relZ = z - cameraZ;
            const scale = fov / (relZ || 1);

            // Calculo da curvatura da dimensão
            const offset = getPathOffset(z, time);
            const camOffset = getPathOffset(cameraZ, time);
            const relX_offset = offset.x - camOffset.x;
            const relY_offset = offset.y - camOffset.y;

            return {
                x: centerX + (x - cameraOffsetX + relX_offset) * scale,
                y: centerY + (y - cameraOffsetY + relY_offset) * scale,
                scale: scale,
                relZ: relZ
            };
        }

        // 1. RENDERIZAR TÚNEL WIREFRAME HOLOGRÁFICO EM 3D (Com afunilamento dinâmico e pulso de energia)
        if (gridOpacity > 0.01) {
            const startRingIdx = Math.max(0, Math.floor((cameraZ - 100) / ringSpacing));
            const endRingIdx = Math.min(Math.floor((cameraZ + 900) / ringSpacing), Math.floor(maxZ / ringSpacing));

            // Pulso de energia holográfica descendo pelo túnel
            const pulseSpeed = 0.007;
            const pulseInterval = 1400;
            const pulseZ = (time * pulseSpeed) % pulseInterval;

            for (let r = startRingIdx; r <= endRingIdx; r++) {
                const ringZ = r * ringSpacing;
                const relZ = ringZ - cameraZ;
                if (relZ <= 8 || relZ > 900) continue;

                // Determina pulso para esse anel específico
                let pulseGlow = 0;
                for (let offsetZ = -5200; offsetZ <= 5200; offsetZ += pulseInterval) {
                    const targetZ = pulseZ + offsetZ;
                    const distToPulse = Math.abs(ringZ - targetZ);
                    if (distToPulse < 250) {
                        pulseGlow = Math.max(pulseGlow, 1.0 - distToPulse / 250);
                    }
                }

                const projScale = fov / relZ;
                const opacity = Math.min(
                    Math.max(0, Math.min(1, (relZ - 8) / 95)),
                    Math.max(0, Math.min(1, (900 - relZ) / 190))
                ) * gridOpacity * (0.16 + pulseGlow * 0.22);

                if (opacity <= 0.01) continue;

                ctx.lineWidth = 0.9 + pulseGlow * 1.5;

                // Rotação em espiral com o tempo e índice do anel
                const ringAngle = r * 0.085 + time * 0.00018;

                // Afunilamento dinâmico (Dynamic Cone Funnel): mais largo próximo à câmera, mais estreito no infinito
                const currentRadius = 550 - relZ * 0.34;

                const pts = [];
                for (let s = 0; s < numSectors; s++) {
                    const angle = ringAngle + (s * Math.PI * 2) / numSectors;
                    const px3d = Math.cos(angle) * currentRadius;
                    const py3d = Math.sin(angle) * currentRadius;

                    const proj = project3D(px3d, py3d, ringZ);
                    pts.push({ x: proj.x, y: proj.y });
                }

                // Desenhar o octógono (anel)
                ctx.beginPath();
                ctx.moveTo(pts[0].x, pts[0].y);
                for (let s = 1; s < numSectors; s++) {
                    ctx.lineTo(pts[s].x, pts[s].y);
                }
                ctx.closePath();
                ctx.strokeStyle = getTunnelColor(ringZ, opacity);
                ctx.stroke();

                // Conectar anel ao próximo anel (linhas longitudinais)
                if (r < Math.floor(maxZ / ringSpacing)) {
                    const nextRingZ = (r + 1) * ringSpacing;
                    const nextRelZ = nextRingZ - cameraZ;
                    if (nextRelZ > 8 && nextRelZ < 900) {
                        const nextRingAngle = (r + 1) * 0.085 + time * 0.00018;
                        const nextRadius = 550 - nextRelZ * 0.34;

                        const nextPts = [];
                        for (let s = 0; s < numSectors; s++) {
                            const angle = nextRingAngle + (s * Math.PI * 2) / numSectors;
                            const px3d = Math.cos(angle) * nextRadius;
                            const py3d = Math.sin(angle) * nextRadius;

                            const proj = project3D(px3d, py3d, nextRingZ);
                            nextPts.push({ x: proj.x, y: proj.y });
                        }

                        ctx.beginPath();
                        for (let s = 0; s < numSectors; s++) {
                            ctx.moveTo(pts[s].x, pts[s].y);
                            ctx.lineTo(nextPts[s].x, nextPts[s].y);
                        }
                        ctx.strokeStyle = getTunnelColor(ringZ, opacity * 0.5);
                        ctx.stroke();
                    }
                }
            }
        }

        // 2. RENDERIZAR PARTÍCULAS 3D, VAGALUMES E EFEITOS WORMHOLE (com drift contínuo independente)
        if (particlesOpacity > 0.01) {
            cosmicParticles.forEach(p => {
                // Drift permanente lento para frente + velocidade de scroll com base na camada (parallax)
                const timeDrift = dt * p.speedVal * 0.9;
                p.z -= timeDrift + (smoothScrollVelocity * p.speedVal * 1200);

                let relZ = p.z - cameraZ;

                // Reciclagem infinita de Z (Z-wrapping) dependendo do sentido do scroll
                if (relZ < 5) {
                    p.z = cameraZ + 5200 - Math.random() * 80;
                    relZ = p.z - cameraZ;
                } else if (relZ > 5200) {
                    p.z = cameraZ + 5 + Math.random() * 80;
                    relZ = p.z - cameraZ;
                }

                // Movimento dos vagalumes (derivas orgânicas tridimensionais)
                let dx = 0;
                let dy = 0;
                if (p.isFirefly) {
                    p.pulsePhase += p.pulseSpeed;
                    dx = Math.sin(time * 0.0009 * p.driftSpeedX + p.pulsePhase) * p.driftAmplitude;
                    dy = Math.cos(time * 0.0009 * p.driftSpeedY + p.pulsePhase) * p.driftAmplitude;
                }

                // Fator de convergência para o centro sob alta velocidade (efeito Wormhole)
                const pullX = p.x * (1.0 - warpFactor * 0.58);
                const pullY = p.y * (1.0 - warpFactor * 0.58);

                const proj = project3D(pullX + dx, pullY + dy, p.z);
                const px = proj.x;
                const py = proj.y;
                const scale = proj.scale;

                // Checagem se a partícula está na tela
                if (px >= 0 && px <= width && py >= 0 && py <= height) {
                    let alpha = 1.0;
                    if (relZ < 250) {
                        alpha = relZ / 250; // Fade-out próximo à câmera
                    } else if (relZ > 4500) {
                        alpha = (5200 - relZ) / 700; // Fade-out à distância
                    }
                    alpha = Math.max(0, Math.min(1.0, alpha));

                    // Pulso dos vagalumes
                    if (p.isFirefly) {
                        const pulse = 0.35 + 0.65 * Math.sin(p.pulsePhase);
                        alpha *= pulse;
                    }

                    alpha *= particlesOpacity;

                    if (alpha > 0.02) {
                        // Se estiver rolando rápido, desenhar linhas de warping (efeito hyperdrive)
                        if (warpFactor > 0.06) {
                            const dxCenter = px - centerX;
                            const dyCenter = py - centerY;
                            const distToCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter) || 1;

                            // Comprimento da trilha proporcional à velocidade de dobra e escala
                            const stretch = warpFactor * 42 * scale;
                            const endX = px + (dxCenter / distToCenter) * stretch;
                            const endY = py + (dyCenter / distToCenter) * stretch;

                            ctx.beginPath();
                            ctx.moveTo(px, py);
                            ctx.lineTo(endX, endY);
                            ctx.strokeStyle = `rgba(${p.color}, ${alpha})`;
                            ctx.lineWidth = p.size * scale * 0.85;
                            ctx.stroke();
                        } else {
                            // Renderização de glow simulado de alta performance
                            const sizeVal = p.size * scale;

                            // Brilho externo sutil (glow)
                            ctx.fillStyle = `rgba(${p.color}, ${alpha * 0.22})`;
                            ctx.beginPath();
                            ctx.arc(px, py, sizeVal * (p.isFirefly ? 2.4 : 1.7), 0, Math.PI * 2);
                            ctx.fill();

                            // Núcleo luminoso
                            ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
                            ctx.beginPath();
                            ctx.arc(px, py, sizeVal * 0.9, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }
            });
        }

        // 3. DESENHAR WIREFRAMES ESPECÍFICOS DAS TECNOLOGIAS (curvando com o project3D)

        // HTML
        if (cameraZ < 1100 && sectionOpacity > 0.01) {
            ctx.lineWidth = 1.1;
            htmlLines.forEach(line => {
                const proj1 = project3D(line.p1.x, line.p1.y, line.p1.z);
                const proj2 = project3D(line.p2.x, line.p2.y, line.p2.z);

                if (proj1.relZ > 10 && proj1.relZ < 900 && proj2.relZ > 10 && proj2.relZ < 900) {
                    const opacity = Math.min(
                        Math.max(0, Math.min(1, (proj1.relZ - 10) / 120)),
                        Math.max(0, Math.min(1, (900 - proj1.relZ) / 180))
                    ) * sectionOpacity;

                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
                    ctx.beginPath();
                    ctx.moveTo(proj1.x, proj1.y);
                    ctx.lineTo(proj2.x, proj2.y);
                    ctx.stroke();
                }
            });
        }

        // CSS
        if (cameraZ > 500 && cameraZ < 1700 && sectionOpacity > 0.01) {
            cssLines.forEach(line => {
                const proj1 = project3D(line.p1.x, line.p1.y, line.p1.z);
                const proj2 = project3D(line.p2.x, line.p2.y, line.p2.z);

                if (proj1.relZ > 10 && proj1.relZ < 900 && proj2.relZ > 10 && proj2.relZ < 900) {
                    const opacity = Math.min(
                        Math.max(0, Math.min(1, (proj1.relZ - 10) / 120)),
                        Math.max(0, Math.min(1, (900 - proj1.relZ) / 180))
                    ) * sectionOpacity;

                    const gradient = ctx.createLinearGradient(proj1.x, proj1.y, proj2.x, proj2.y);
                    gradient.addColorStop(0, `rgba(139, 92, 246, ${opacity * 0.18})`);
                    gradient.addColorStop(0.5, `rgba(56, 189, 248, ${opacity * 0.25})`);
                    gradient.addColorStop(1, `rgba(139, 92, 246, ${opacity * 0.18})`);

                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(proj1.x, proj1.y);
                    ctx.lineTo(proj2.x, proj2.y);
                    ctx.stroke();
                }
            });
        }

        // JavaScript
        if (cameraZ > 1100 && cameraZ < 2300 && sectionOpacity > 0.01) {
            jsNodes3D.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;
                if (node.x < -320 || node.x > 320) node.vx = -node.vx;
                if (node.y < -220 || node.y > 220) node.vy = -node.vy;

                const proj = project3D(node.x, node.y, node.z);
                if (proj.relZ > 10 && proj.relZ < 900) {
                    const dx = proj.x - mouseX;
                    const dy = proj.y - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    // Modificado para uma reação ao mouse minimalista e muito sutil
                    if (dist < 90) {
                        const force = (1 - (dist / 90)) * 0.8;
                        node.x += (dx / dist) * force * 0.15;
                        node.y += (dy / dist) * force * 0.15;
                    }

                    const opacity = Math.min(
                        Math.max(0, Math.min(1, (proj.relZ - 10) / 120)),
                        Math.max(0, Math.min(1, (900 - proj.relZ) / 180))
                    ) * sectionOpacity;

                    ctx.fillStyle = `rgba(250, 204, 21, ${opacity * 0.75})`;
                    ctx.beginPath();
                    ctx.arc(proj.x, proj.y, node.radius * proj.scale * 0.8, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            for (let i = 0; i < jsNodes3D.length; i++) {
                const n1 = jsNodes3D[i];
                const rz1 = n1.z - cameraZ;
                if (rz1 <= 10 || rz1 > 900) continue;

                for (let j = i + 1; j < jsNodes3D.length; j++) {
                    const n2 = jsNodes3D[j];
                    const rz2 = n2.z - cameraZ;
                    if (rz2 <= 10 || rz2 > 900) continue;

                    const dx = n2.x - n1.x;
                    const dy = n2.y - n1.y;
                    const dz = n2.z - n1.z;
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist < 140) {
                        const midZ = (rz1 + rz2) / 2;
                        const proj1 = project3D(n1.x, n1.y, n1.z);
                        const proj2 = project3D(n2.x, n2.y, n2.z);

                        const opacity = (1 - (dist / 140)) * Math.min(
                            Math.max(0, Math.min(1, (midZ - 10) / 120)),
                            Math.max(0, Math.min(1, (900 - midZ) / 180))
                        ) * sectionOpacity;

                        if (opacity > 0.05) {
                            drawElectricity(proj1.x, proj1.y, proj2.x, proj2.y, opacity * 0.5);
                        }
                    }
                }
            }
        }

        // Git
        if (cameraZ > 1700 && cameraZ < 2900 && sectionOpacity > 0.01) {
            gitLines.forEach(line => {
                const proj1 = project3D(line.p1.x, line.p1.y, line.p1.z);
                const proj2 = project3D(line.p2.x, line.p2.y, line.p2.z);

                if (proj1.relZ > 10 && proj1.relZ < 900 && proj2.relZ > 10 && proj2.relZ < 900) {
                    const opacity = Math.min(
                        Math.max(0, Math.min(1, (proj1.relZ - 10) / 120)),
                        Math.max(0, Math.min(1, (900 - proj1.relZ) / 180))
                    ) * sectionOpacity;

                    ctx.strokeStyle = line.color;
                    ctx.globalAlpha = opacity * 0.35;
                    ctx.lineWidth = 1.8;
                    ctx.beginPath();
                    ctx.moveTo(proj1.x, proj1.y);
                    ctx.lineTo(proj2.x, proj2.y);
                    ctx.stroke();
                    ctx.globalAlpha = 1.0;
                }
            });
        }

        // GitHub
        if (cameraZ > 2300 && cameraZ < 3500 && sectionOpacity > 0.01) {
            ghLines.forEach(line => {
                const proj1 = project3D(line.p1.x, line.p1.y, line.p1.z);
                const proj2 = project3D(line.p2.x, line.p2.y, line.p2.z);

                if (proj1.relZ > 10 && proj1.relZ < 900 && proj2.relZ > 10 && proj2.relZ < 900) {
                    const opacity = Math.min(
                        Math.max(0, Math.min(1, (proj1.relZ - 10) / 120)),
                        Math.max(0, Math.min(1, (900 - proj1.relZ) / 180))
                    ) * sectionOpacity;

                    ctx.strokeStyle = `rgba(167, 139, 250, ${opacity * 0.28})`;
                    ctx.lineWidth = 1.4;
                    ctx.beginPath();
                    ctx.moveTo(proj1.x, proj1.y);
                    ctx.lineTo(proj2.x, proj2.y);
                    ctx.stroke();
                }
            });
            ghNodes.forEach(node => {
                const proj = project3D(node.x, node.y, node.z);
                if (proj.relZ > 10 && proj.relZ < 900) {
                    const opacity = Math.min(
                        Math.max(0, Math.min(1, (proj.relZ - 10) / 120)),
                        Math.max(0, Math.min(1, (900 - proj.relZ) / 180))
                    ) * sectionOpacity;

                    ctx.fillStyle = `rgba(167, 139, 250, ${opacity * 0.85})`;
                    ctx.beginPath();
                    ctx.arc(proj.x, proj.y, 4 * proj.scale, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
        }

        // Antigravity (Cena Exclusiva - Representação de Telas de Design / Grid Flutuante 3D)
        if (cameraZ > 2900 && cameraZ < 4100 && sectionOpacity > 0.01) {
            antigravityPlanes.forEach(plane => {
                const relZ = plane.z - cameraZ;
                if (relZ > 8 && relZ < 900) {
                    // Efeito anti-gravitacional: flutuação ondulatória suave e sem peso
                    const driftY = Math.sin(time * 0.0011 + plane.driftOffset) * 16;
                    const driftX = Math.cos(time * 0.0008 + plane.driftOffset) * 10;

                    const opacity = Math.min(
                        Math.max(0, Math.min(1, (relZ - 8) / 110)),
                        Math.max(0, Math.min(1, (900 - relZ) / 180))
                    ) * sectionOpacity;

                    if (opacity > 0.01) {
                        const hw = plane.width / 2;
                        const hh = plane.height / 2;

                        // 4 cantos em coordenadas locais do layout
                        const corners = [
                            { x: -hw, y: -hh },
                            { x: hw, y: -hh },
                            { x: hw, y: hh },
                            { x: -hw, y: hh }
                        ];

                        // Transformar com rotação 3D sutil e projetar usando project3D
                        const projCorners = corners.map(c => {
                            const rx = c.x * Math.cos(plane.rotation) - c.y * Math.sin(plane.rotation);
                            const ry = c.x * Math.sin(plane.rotation) + c.y * Math.cos(plane.rotation);

                            const finalX = plane.x + rx + driftX;
                            const finalY = plane.y + ry + driftY;

                            return project3D(finalX, finalY, plane.z);
                        });

                        const scale = projCorners[0].scale;

                        // Desenhar a moldura do artboard de design (fino e brilhante em coral)
                        ctx.strokeStyle = `rgba(246, 76, 68, ${opacity * 0.38})`;
                        ctx.lineWidth = 1.3 * Math.max(0.6, scale);
                        ctx.beginPath();
                        ctx.moveTo(projCorners[0].x, projCorners[0].y);
                        ctx.lineTo(projCorners[1].x, projCorners[1].y);
                        ctx.lineTo(projCorners[2].x, projCorners[2].y);
                        ctx.lineTo(projCorners[3].x, projCorners[3].y);
                        ctx.closePath();
                        ctx.stroke();

                        // Desenhar linhas de grid internas representativas
                        ctx.strokeStyle = `rgba(246, 76, 68, ${opacity * 0.14})`;
                        ctx.beginPath();
                        // Linha divisória horizontal
                        ctx.moveTo((projCorners[0].x + projCorners[3].x) / 2, (projCorners[0].y + projCorners[3].y) / 2);
                        ctx.lineTo((projCorners[1].x + projCorners[2].x) / 2, (projCorners[1].y + projCorners[2].y) / 2);
                        // Linha divisória vertical
                        ctx.moveTo((projCorners[0].x + projCorners[1].x) / 2, (projCorners[0].y + projCorners[1].y) / 2);
                        ctx.lineTo((projCorners[3].x + projCorners[2].x) / 2, (projCorners[3].y + projCorners[2].y) / 2);
                        ctx.stroke();

                        // Vértices luminosos nos cantos (pontos de âncora/vetor de design)
                        ctx.fillStyle = `rgba(246, 76, 68, ${opacity * 0.85})`;
                        projCorners.forEach(c => {
                            ctx.beginPath();
                            ctx.arc(c.x, c.y, 2.5 * c.scale, 0, Math.PI * 2);
                            ctx.fill();
                        });
                    }
                }
            });
        }

        // ChatGPT (z-depth deslocado: 3900 a 4500)
        if (cameraZ > 3500 && cameraZ < 4700 && sectionOpacity > 0.01) {
            chatgptTracks.forEach(track => {
                const proj1 = project3D(track.p1.x, track.p1.y, track.p1.z);
                const proj2 = project3D(track.p2.x, track.p2.y, track.p2.z);

                if (proj1.relZ > 10 && proj1.relZ < 900 && proj2.relZ > 10 && proj2.relZ < 900) {
                    const opacity = Math.min(
                        Math.max(0, Math.min(1, (proj1.relZ - 10) / 120)),
                        Math.max(0, Math.min(1, (900 - proj1.relZ) / 180))
                    ) * sectionOpacity;

                    ctx.strokeStyle = `rgba(52, 211, 153, ${opacity * 0.18})`;
                    ctx.lineWidth = 1.0;
                    ctx.beginPath();
                    ctx.moveTo(proj1.x, proj1.y);
                    ctx.lineTo(proj2.x, proj2.y);
                    ctx.stroke();
                }
            });

            chatgptPackets.forEach(p => {
                p.progress += p.speed;
                if (p.progress > 1.0) p.progress = 0;

                const track = chatgptTracks[p.trackIdx];
                const px3d = track.p1.x + (track.p2.x - track.p1.x) * p.progress;
                const py3d = track.p1.y + (track.p2.y - track.p1.y) * p.progress;
                const pz3d = track.p1.z + (track.p2.z - track.p1.z) * p.progress;

                const proj = project3D(px3d, py3d, pz3d);
                if (proj.relZ > 10 && proj.relZ < 900) {
                    const opacity = Math.min(
                        Math.max(0, Math.min(1, (proj.relZ - 10) / 120)),
                        Math.max(0, Math.min(1, (900 - proj.relZ) / 180))
                    ) * sectionOpacity;

                    ctx.fillStyle = `rgba(52, 211, 153, ${opacity * 0.8})`;
                    ctx.beginPath();
                    ctx.arc(proj.x, proj.y, p.size * proj.scale * 0.7, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
        }

        // Gemini (z-depth deslocado: 4500 a 5200)
        if (cameraZ > 4100 && sectionOpacity > 0.01) {
            geminiRings.forEach(ring => {
                const proj = project3D(0, 0, ring.z);
                if (proj.relZ > 10 && proj.relZ < 900) {
                    const opacity = Math.min(
                        Math.max(0, Math.min(1, (proj.relZ - 10) / 120)),
                        Math.max(0, Math.min(1, (900 - proj.relZ) / 180))
                    ) * sectionOpacity;

                    ctx.strokeStyle = `rgba(192, 132, 252, ${opacity * 0.22})`;
                    ctx.lineWidth = 1.4;
                    ctx.beginPath();
                    ctx.arc(proj.x, proj.y, ring.radius * proj.scale, 0, Math.PI * 2);
                    ctx.stroke();
                }
            });
            geminiVectors.forEach(vec => {
                const proj1 = project3D(vec.p1.x, vec.p1.y, vec.p1.z);
                const proj2 = project3D(vec.p2.x, vec.p2.y, vec.p2.z);
                if (proj1.relZ > 10 && proj1.relZ < 900 && proj2.relZ > 10 && proj2.relZ < 900) {
                    const opacity = Math.min(
                        Math.max(0, Math.min(1, (proj1.relZ - 10) / 120)),
                        Math.max(0, Math.min(1, (900 - proj1.relZ) / 180))
                    ) * sectionOpacity;

                    ctx.strokeStyle = `rgba(192, 132, 252, ${opacity * 0.12})`;
                    ctx.lineWidth = 1.0;
                    ctx.beginPath();
                    ctx.moveTo(proj1.x, proj1.y);
                    ctx.lineTo(proj2.x, proj2.y);
                    ctx.stroke();
                }
            });
        }

        // Restaurar rotação da câmera (ctx.restore) ANTES dos textos para mantê-los retos e legíveis
        ctx.restore();

        // 4. DESENHAR TEXTOS FLUTUANTES EM 3D (Desenhados fora do save/restore para não girarem)
        if (sectionOpacity > 0.01) {
            floatingTexts.forEach(txt => {
                const proj = project3D(txt.x, txt.y, txt.z);
                if (proj.relZ > 8 && proj.relZ < 900) {
                    let opacity = 1.0;
                    if (proj.relZ < 200) {
                        opacity = (proj.relZ - 8) / 192;
                    } else if (proj.relZ > 700) {
                        opacity = (900 - proj.relZ) / 200;
                    }
                    opacity = Math.max(0, Math.min(1.0, opacity)) * sectionOpacity;

                    if (opacity > 0.02) {
                        const fontSize = Math.max(14, Math.min(54 * proj.scale, 95));
                        ctx.font = `800 ${fontSize}px 'Poppins', sans-serif`;
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillStyle = txt.color;
                        ctx.globalAlpha = opacity;

                        ctx.shadowColor = txt.color;
                        ctx.shadowBlur = Math.min(16 * proj.scale, 24);
                        ctx.fillText(txt.title, proj.x, proj.y);
                        ctx.shadowBlur = 0;

                        const descFontSize = Math.max(10, Math.min(16 * proj.scale, 22));
                        ctx.font = `300 ${descFontSize}px var(--font-body)`;
                        ctx.fillStyle = "#cbd5e1";
                        ctx.fillText(txt.desc, proj.x, proj.y + fontSize * 0.75 + 10);

                        ctx.globalAlpha = 1.0;
                    }
                }
            });
        }

        animationId = requestAnimationFrame(animate);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
                if (!animationId) {
                    animate(performance.now());
                }
            } else {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
        });
    }, { threshold: 0.01 });

    observer.observe(techJourney);

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("scroll", updateScroll, { passive: true });

    resizeCanvas();
    updateScroll();
}

/**
 * ==========================================================================
 * FASE 7: ENCERRAMENTO DA JORNADA E CONTATOS (ENTIDADE CÓSMICA & PAINEL INTERATIVO)
 * ==========================================================================
 */
function initEndingJourney() {
    const section = document.getElementById("ending");
    const canvas = document.getElementById("ending-canvas");
    const panel = document.getElementById("holo-panel");

    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d");

    let width = canvas.width = canvas.clientWidth;
    let height = canvas.height = canvas.clientHeight;

    let isVisible = false;
    let animationId = null;

    // Escalonamento para dar protagonismo visual absoluto à Entidade (Altura ideal entre 120px e 180px)
    const scaleFactor = 1.25; // Slightly larger for better details

    // Configurações e coordenadas da Entidade (Começa fora da tela à direita para surgir suavemente)
    let cx = width * 1.25;
    let cy = height * 0.50;

    // Articulações do braço (ombro -> cotovelo -> ponta do dedo indicador)
    let shX = cx + 8 * scaleFactor;
    let shY = cy - 35 * scaleFactor;
    let finX = cx - 40 * scaleFactor;
    let finY = cy + 10 * scaleFactor;

    // Posição cinematográfica da mão esquerda (lerp suave para os ícones)
    let leftHandLerpX = cx - 13 * scaleFactor;
    let leftHandLerpY = cy - 1 * scaleFactor;

    // Alpha da presença da mão invisível (0 = invisível, 1 = presente)
    let phantomTouchAlpha = 0;

    // Alvo atual da mão (botão da sequência de piloto automático)
    let targetX = cx - 40 * scaleFactor;
    let targetY = cy + 100 * scaleFactor;
    let isHoveringPanel = false;
    let hoveredTech = null;

    // Piloto automático para interações de toque sequencial 100% automatizado
    let lastAutopilotStateTime = performance.now();
    let autopilotState = "resting"; // resting, reaching, touching, sequence_completed, farewell_tilt, dissolving, absent
    let autopilotBtn = null;
    let autopilotTech = null;
    let autopilotIndex = 0; // Índice do botão atual no ciclo sequencial

    // Estado de Introdução Cinematográfica
    let introStartTime = null;

    // Inicializar estrelas estáticas de fundo (Calmaria cósmica)
    const bgStars = [];
    for (let i = 0; i < 95; i++) {
        bgStars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 0.95 + 0.15,
            alpha: Math.random() * 0.65 + 0.1,
            pulseSpeed: Math.random() * 0.02 + 0.005,
            phase: Math.random() * Math.PI * 2
        });
    }

    // Cabelos volumosos e cacheados em camadas
    const hairClusters = [];
    const numClusters = 180;
    for (let i = 0; i < numClusters; i++) {
        // Distribuição vertical em cascata (formato de gota/cascata longa de costas)
        const ly = -14 + Math.random() * 70; // De cima da cabeça (-14) até o meio das costas (+56)

        // Largura máxima do cabelo dependendo da altura (mais estreito no topo, largo nos ombros, afinando embaixo)
        let w;
        if (ly < 10) {
            w = 18 + (ly + 14) * 0.8;
        } else {
            w = 34 - (ly - 10) * 0.22;
        }
        const lx = (Math.random() - 0.5) * 2.4 * w;

        // Cachos gordinhos na parte central e mechas mais finas nas bordas externas
        const distFromCenter = Math.abs(lx) / w;
        const radius = (11 + Math.random() * 10) * (1.05 - distFromCenter * 0.30);

        hairClusters.push({
            lx: lx,
            ly: ly,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            radius: radius,
            color: Math.random() > 0.55
                ? "78, 56, 46"
                : "96, 70, 58",
            color: Math.random() > 0.55
                ? "95, 69, 55"
                : "120, 88, 70", // Tons escuros de espaço profundo
            starTwinkle: Math.random() * Math.PI * 2,
            starSpeed: 0.015 + Math.random() * 0.025,
            starSize: 0.6 + Math.random() * 1.1,
            // Detalhes em espiral internos para textura de cabelo cacheado
            spiralOffsets: Array.from({ length: 3 }, () => ({
                phase: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.012,
                scale: 0.5 + Math.random() * 0.5,
                direction: Math.random() > 0.5 ? 1 : -1
            }))
        });
    }

    // Partículas de poeira cósmica em vórtice para a entrada cinematográfica
    const vortexParticles = [];
    for (let i = 0; i < 65; i++) {
        vortexParticles.push({
            angle: Math.random() * Math.PI * 2,
            radius: 70 + Math.random() * 130,
            speed: 0.018 + Math.random() * 0.025,
            size: 0.8 + Math.random() * 2.2,
            color: Math.random() > 0.5 ? "168, 85, 247" : "56, 189, 248",
            opacity: 0.4 + Math.random() * 0.5
        });
    }

    // Elementos de reação visual do Painel Holográfico
    const reactionParticles = [];
    const reactionLines = [];
    const buttons = panel.querySelectorAll(".holo-btn");
    const farewellParticles = [];

    function releaseFarewellParticles(time) {
        const canvasRect = canvas.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        const panelX = panelRect.left - canvasRect.left + panelRect.width / 2;
        const panelY = panelRect.top - canvasRect.top + panelRect.height / 2;

        for (let i = 0; i < 96; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.sqrt(Math.random());
            farewellParticles.push({
                startX: cx + Math.cos(angle) * radius * 42 * scaleFactor,
                startY: cy - 20 * scaleFactor + Math.sin(angle) * radius * 76 * scaleFactor,
                targetX: panelX,
                targetY: panelY,
                delay: Math.random() * 650,
                startTime: time,
                size: 0.7 + Math.random() * 1.7,
                phase: Math.random() * Math.PI * 2,
                color: Math.random() > 0.5 ? "192, 132, 252" : "148, 163, 248"
            });
        }
    }

    function drawFarewellParticles(time) {
        farewellParticles.forEach(p => {
            const progress = Math.max(0, Math.min(1, (time - p.startTime - p.delay) / 1900));
            if (progress <= 0 || progress >= 1) return;

            const eased = progress * progress * (3 - 2 * progress);
            const drift = (1 - eased) * 10;
            const x = p.startX + (p.targetX - p.startX) * eased + Math.sin(time * 0.006 + p.phase) * drift;
            const y = p.startY + (p.targetY - p.startY) * eased + Math.cos(time * 0.005 + p.phase) * drift;
            const alpha = Math.sin(progress * Math.PI) * 0.9;
            const glow = ctx.createRadialGradient(x, y, 0, x, y, p.size * 3.2);
            glow.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
            glow.addColorStop(0.4, `rgba(${p.color}, ${alpha * 0.65})`);
            glow.addColorStop(1, `rgba(${p.color}, 0)`);
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(x, y, p.size * 3.2, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function triggerReaction() { }


    function resizeCanvas() {
        width = canvas.width = canvas.clientWidth;
        height = canvas.height = canvas.clientHeight;

        // Inicializa a Guardiã à direita para ela surgir deslizando suavemente
        if (cx === undefined || cx > width || autopilotState === "resting") {
            cx = width * 1.25;
            cy = (width < 992) ? (height * 0.40) : (height * 0.50);
        }

        shX = cx + 8 * scaleFactor;
        shY = cy - 35 * scaleFactor;

        // Define o primeiro botão (Gmail) como alvo inicial da sequência
        if (autopilotState === "resting" && autopilotIndex === 0) {
            const btns = Array.from(buttons);
            if (btns.length > 0) {
                const canvasRect = canvas.getBoundingClientRect();
                const btnRect = btns[0].getBoundingClientRect();

                targetX = btnRect.left - canvasRect.left + btnRect.width / 2;
                targetY = btnRect.top - canvasRect.top + btnRect.height / 2;

                finX = targetX + 40 * scaleFactor;
                finY = targetY;
            }
        }
    }

    function tick(time) {
        if (!isVisible) {
            animationId = null;
            return;
        }

        ctx.clearRect(0, 0, width, height);

        // 1. Desenhar estrelas estáticas de fundo
        bgStars.forEach(s => {
            s.phase += s.pulseSpeed;
            const currentAlpha = s.alpha * (0.4 + 0.6 * Math.sin(s.phase));
            ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
            ctx.fillRect(s.x, s.y, s.size, s.size);
        });

        // 2. Oscilação com Gravidade Zero (Flutuação Lenta)
        const floatTime = time * 0.0012;
        const floatX = Math.sin(floatTime * 0.5) * 8;
        const floatY = Math.cos(floatTime * 0.4) * 12;
        const floatTilt = Math.sin(floatTime * 0.3) * 0.025; // Inclinação leve

        // Coordenadas globais do dedo
        const dxF = finX - cx;
        const dyF = finY - cy;
        const cosTF = Math.cos(floatTilt);
        const sinTF = Math.sin(floatTilt);
        const globalFinX = cx + (dxF * cosTF - dyF * sinTF) + floatX;
        const globalFinY = cy + (dxF * sinTF + dyF * cosTF) + floatY;

        // --- CONTROLES DA INTRODUÇÃO CINEMATOGRÁFICA ---
        if (introStartTime === null) {
            introStartTime = time;
        }
        const elapsed = time - introStartTime;
        const transformProgress = Math.min(1.0, elapsed / 2500); // Aparece suavemente em 2.5s

        // Posição de repouso responsiva
        const restingX = (width < 992) ? (width * 0.52) : (width * 0.72);
        const restingY = (width < 992) ? (height * 0.40) : (height * 0.50);

        // Coordenadas alvo do corpo
        let bodyTargetX = restingX;
        let bodyTargetY = restingY;

        // Vórtice de poeira cósmica na entrada
        if (elapsed < 3200) {
            vortexParticles.forEach(p => {
                p.angle -= p.speed;
                p.radius -= 1.4;
                if (p.radius < 5) {
                    p.radius = 100 + Math.random() * 110;
                    p.angle = Math.random() * Math.PI * 2;
                }
                const px = cx + Math.cos(p.angle) * p.radius * scaleFactor;
                const py = cy + Math.sin(p.angle) * p.radius * scaleFactor;
                const pOpacity = p.opacity * (1.0 - elapsed / 3200);
                if (pOpacity > 0) {
                    ctx.fillStyle = `rgba(${p.color}, ${pOpacity})`;
                    ctx.beginPath();
                    ctx.arc(px + floatX, py + floatY, p.size * scaleFactor, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
        }

        // --- MOTOR DE PILOTO AUTOMÁTICO (INTERAÇÃO SEQUENCIAL SUAVE) ---
        if (!isHoveringPanel && transformProgress >= 0.8) {
            const timeSinceLastState = time - lastAutopilotStateTime;
            const btns = Array.from(buttons);

            if (autopilotState === "resting") {
                if (autopilotIndex === 0) {
                    btns.forEach(btn => btn.classList.remove("tech-charged"));
                }

                // Aguarda 2.2 segundos contemplativos antes de tocar o próximo ícone
                if (timeSinceLastState > 2200 && btns.length > 0) {
                    autopilotBtn = btns[autopilotIndex];
                    autopilotTech = autopilotBtn.getAttribute("data-tech");

                    const canvasRect = canvas.getBoundingClientRect();
                    const btnRect = autopilotBtn.getBoundingClientRect();

                    targetX = btnRect.left - canvasRect.left + btnRect.width / 2;
                    targetY = btnRect.top - canvasRect.top + btnRect.height / 2;

                    autopilotState = "reaching";
                    lastAutopilotStateTime = time;
                }
            } else if (autopilotState === "reaching") {
                // Voo suave: corpo flutua até perto do botão
                bodyTargetX = targetX + 18 * scaleFactor;
                bodyTargetY = targetY;

                const distToTarget = Math.sqrt((targetX - globalFinX) ** 2 + (targetY - globalFinY) ** 2);
                if (distToTarget < 12 * scaleFactor || timeSinceLastState > 3000) {
                    if (autopilotBtn) {
                        autopilotBtn.classList.add("tech-charged");
                        autopilotBtn.classList.remove("autopilot-hover");
                    }

                    // Dispara reação visual amarela de interface premium (pulso de radar + caixa digital)
                    reactionLines.push({
                        type: "pulse",
                        x: targetX, y: targetY,
                        radius: 3,
                        maxRadius: 45 * scaleFactor,
                        color: "234, 179, 8",
                        speed: 2.8,
                        alpha: 1.0
                    });
                    // (box removido: causava aparência de haste amarela)

                    triggerReaction(autopilotTech, targetX, targetY);

                    autopilotState = "touching";
                    lastAutopilotStateTime = time;
                }
            } else if (autopilotState === "touching") {
                bodyTargetX = targetX + 18 * scaleFactor;
                bodyTargetY = targetY;

                // Mantém o toque por 1.5 segundos (ativação)
                if (timeSinceLastState > 1500) {
                    autopilotIndex++;
                    if (autopilotIndex >= btns.length) {
                        autopilotState = "sequence_completed";
                        lastAutopilotStateTime = time;
                    } else {
                        autopilotBtn = btns[autopilotIndex];
                        autopilotTech = autopilotBtn.getAttribute("data-tech");

                        const canvasRect = canvas.getBoundingClientRect();
                        const btnRect = autopilotBtn.getBoundingClientRect();

                        targetX = btnRect.left - canvasRect.left + btnRect.width / 2;
                        targetY = btnRect.top - canvasRect.top + btnRect.height / 2;

                        autopilotState = "reaching";
                        lastAutopilotStateTime = time;
                    }
                }
            } else if (autopilotState === "sequence_completed") {
                bodyTargetX = restingX;
                bodyTargetY = restingY;

                if (timeSinceLastState > 1000) {
                    autopilotState = "farewell_tilt";
                    lastAutopilotStateTime = time;
                }
            } else if (autopilotState === "farewell_tilt") {
                bodyTargetX = restingX;
                bodyTargetY = restingY;
                if (timeSinceLastState > 800) {
                    releaseFarewellParticles(time);
                    panel.classList.add("cinematic-glow");
                    autopilotState = "dissolving";
                    lastAutopilotStateTime = time;
                }
            } else if (autopilotState === "dissolving") {
                bodyTargetX = restingX;
                bodyTargetY = restingY;
                if (timeSinceLastState > 2600) {
                    farewellParticles.length = 0;
                    autopilotState = "absent";
                    lastAutopilotStateTime = time;
                }
            } else if (autopilotState === "absent") {
                if (timeSinceLastState > 2500) {
                    btns.forEach(btn => {
                        btn.classList.remove("tech-charged");
                        btn.classList.remove("autopilot-hover");
                    });
                    panel.classList.remove("cinematic-glow");
                    farewellParticles.length = 0;
                    hairClusters.forEach(c => {
                        c.x = 0;
                        c.y = 0;
                        c.vx = 0;
                        c.vy = 0;
                    });
                    autopilotIndex = 0;
                    autopilotState = "resting";
                    introStartTime = time;
                    lastAutopilotStateTime = time;
                    resizeCanvas();
                }
            }
        }

        // Easing do Voo: interpolação suave da posição do corpo
        if (elapsed < 5500) {
            const startX = width * 1.25;
            const progress = Math.min(1.0, elapsed / 5500);
            const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart: entrada muito suave
            cx = startX + (restingX - startX) * eased;
            cy = restingY;
        } else {
            cx += (bodyTargetX - cx) * 0.018; // movimento mais lento e suave
            cy += (bodyTargetY - cy) * 0.018;
        }

        // Atualiza ombro e ponto inicial do braço a cada frame para seguir cx/cy
        // (sem isso o ombro fica preso na posição inicial fora da tela, causando linha enorme)
        shX = cx + 8 * scaleFactor;
        shY = cy - 35 * scaleFactor;



        // Converte o alvo global para o sistema de coordenadas local flutuante do braço
        const dxT = targetX - cx;
        const dyT = targetY - cy;
        const cosT = Math.cos(-floatTilt);
        const sinT = Math.sin(-floatTilt);

        let localTargetX = cx + (dxT * cosT - dyT * sinT) - floatX;
        let localTargetY = cy + (dxT * sinT + dyT * cosT) - floatY;

        // Se estiver descansando, repousa o braço sutilmente ao lado do corpo
        if (autopilotState === "resting" || autopilotState === "sequence_completed" || transformProgress < 0.8) {
            localTargetX = cx - 18 * scaleFactor;
            localTargetY = cy - 5 * scaleFactor;
        }

        // ============================================================
        // LERP CINEMATOGRÁFICO DO BRAÇO ESQUERDO
        // Lento e elegante: 0.025 ao alvo, 0.055 ao repouso
        // ============================================================
        const lRestX = cx - 13 * scaleFactor + Math.sin(time * 0.0012 - 0.4) * 0.8;
        const lRestY = cy - 1 * scaleFactor + Math.sin(time * 0.0012) * 0.5;
        if ((autopilotState === "reaching" || autopilotState === "touching") && transformProgress > 0.8) {
            // Clamp: não esticar mais do que o braço comporta
            const maxLR = 46 * scaleFactor * 1.75;
            const lShX = cx - 8 * scaleFactor;
            const lShY = cy - 33 * scaleFactor;
            let ltX = localTargetX;
            let ltY = localTargetY;
            const ld = Math.sqrt((ltX - lShX) ** 2 + (ltY - lShY) ** 2) || 1;
            if (ld > maxLR) { ltX = lShX + (ltX - lShX) / ld * maxLR; ltY = lShY + (ltY - lShY) / ld * maxLR; }
            // Lerp cinematográfico lento
            leftHandLerpX += (ltX - leftHandLerpX) * 0.028;
            leftHandLerpY += (ltY - leftHandLerpY) * 0.028;
        } else {
            leftHandLerpX += (lRestX - leftHandLerpX) * 0.055;
            leftHandLerpY += (lRestY - leftHandLerpY) * 0.055;
        }

        const farewellElapsed = time - lastAutopilotStateTime;
        const farewellTilt = autopilotState === "farewell_tilt"
            ? Math.min(1, farewellElapsed / 800) * 0.045
            : autopilotState === "dissolving" ? 0.045 : 0;
        const dissolveProgress = autopilotState === "dissolving"
            ? Math.min(1, farewellElapsed / 2200)
            : autopilotState === "absent" ? 1 : 0;
        const characterOpacity = 1 - dissolveProgress;


        // =================================================================
        // TRILHA ESTELAR COSMICA — Atrás da personagem, vem do infinito
        // termina nas costas dela como partículas estelares
        // =================================================================
        if (transformProgress > 0.35 && characterOpacity > 0.01) {
            const backX = cx + floatX;
            const backY = cy - 30 * scaleFactor + floatY;
            const trailOriginX = width + 80;
            const trailOriginY = backY + (height * 0.5 - backY) * 0.25;
            const trailTime = time * 0.0008;
            const numTrailNodes = 9;
            const trailNodes = [];
            for (let j = 0; j < numTrailNodes; j++) {
                const t = j / (numTrailNodes - 1);
                const ctrlX = (trailOriginX + backX) * 0.5 + 40;
                const ctrlY = Math.min(trailOriginY, backY) - 35 * scaleFactor;
                const bx = (1 - t) * (1 - t) * trailOriginX + 2 * (1 - t) * t * ctrlX + t * t * backX;
                const by = (1 - t) * (1 - t) * trailOriginY + 2 * (1 - t) * t * ctrlY + t * t * backY;
                const waveAmp = Math.sin(t * Math.PI) * 7 * scaleFactor;
                const wx = bx + Math.sin(trailTime + j * 0.8) * waveAmp * 0.4;
                const wy = by + Math.cos(trailTime * 0.7 + j * 0.6) * waveAmp;
                const endFade = t > 0.75 ? 1.0 - ((t - 0.75) / 0.25) : 1.0;
                const startFade = Math.min(1.0, t * 4);
                const alpha = endFade * startFade * 0.55 * transformProgress * characterOpacity;
                trailNodes.push({ x: wx, y: wy, t, alpha });
            }
            ctx.save();
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            // Estrelas cintilantes em cada nó
            trailNodes.forEach((node, j) => {
                if (node.alpha < 0.02) return;
                const isNearBack = node.t > 0.72;
                const glowR = isNearBack ? (3.5 + 1.5 * Math.sin(trailTime * 1.3 + j)) : (2.5 + 0.8 * Math.sin(trailTime + j * 0.9));
                const glowAlpha = isNearBack ? node.alpha * 0.8 : node.alpha * 0.65;
                const starGrad = ctx.createRadialGradient(node.x, node.y, 0.2, node.x, node.y, glowR * 2.5);
                starGrad.addColorStop(0, `rgba(255, 255, 255, ${glowAlpha})`);
                starGrad.addColorStop(0.35, `rgba(148, 163, 248, ${glowAlpha * 0.55})`);
                starGrad.addColorStop(1, `rgba(168, 85, 247, 0)`);
                ctx.fillStyle = starGrad;
                ctx.beginPath();
                ctx.arc(node.x, node.y, glowR * 2.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = `rgba(255, 255, 255, ${glowAlpha * 1.1})`;
                ctx.beginPath();
                ctx.arc(node.x, node.y, Math.max(0.6, glowR * 0.35), 0, Math.PI * 2);
                ctx.fill();
                if (!isNearBack && node.alpha > 0.1) {
                    ctx.strokeStyle = `rgba(224, 231, 255, ${node.alpha * 0.5})`;
                    ctx.lineWidth = 0.4;
                    const crossSize = 3 + Math.sin(trailTime * 0.8 + j) * 0.8;
                    ctx.beginPath();
                    ctx.moveTo(node.x - crossSize, node.y); ctx.lineTo(node.x + crossSize, node.y);
                    ctx.moveTo(node.x, node.y - crossSize); ctx.lineTo(node.x, node.y + crossSize);
                    ctx.stroke();
                }
            });
            // Partículas estelares dissolvendo nas costas
            const numDissolvePts = 14;
            for (let p = 0; p < numDissolvePts; p++) {
                const pSeed = p * 137.508;
                const pAngle = pSeed * 0.0174533 + trailTime * (0.4 + (p % 3) * 0.2);
                const pDist = (8 + (p % 5) * 6 + Math.sin(trailTime * 0.9 + p) * 4) * scaleFactor;
                const px = backX + Math.cos(pAngle) * pDist;
                const py = (backY - 5 * scaleFactor) + Math.sin(pAngle) * pDist * 0.6;
                const pPhase = Math.sin(trailTime * 1.1 + p * 0.7);
                const pAlpha = (0.25 + 0.45 * pPhase) * transformProgress;
                if (pAlpha > 0.05) {
                    const pSize = 0.7 + 0.6 * Math.abs(pPhase);
                    const pGrad = ctx.createRadialGradient(px, py, 0, px, py, pSize * 3);
                    pGrad.addColorStop(0, `rgba(255, 255, 255, ${pAlpha})`);
                    pGrad.addColorStop(0.5, `rgba(192, 132, 252, ${pAlpha * 0.4})`);
                    pGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');
                    ctx.fillStyle = pGrad;
                    ctx.beginPath();
                    ctx.arc(px, py, pSize * 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.restore();
        }

        // A personagem só é desenhada enquanto ainda há matéria para dissolver.
        if (characterOpacity > 0.001) {
            ctx.save();
            ctx.globalAlpha = characterOpacity;
            ctx.translate(floatX, floatY);

            ctx.translate(cx, cy);
            ctx.rotate(floatTilt + farewellTilt);
            ctx.translate(-cx, -cy);

            // Configuração de Gradientes de Pele (Elegante cobre/bronze starlit com rim-light dourado e azul)
            const skinGrad = ctx.createLinearGradient(cx - 10 * scaleFactor, cy - 45 * scaleFactor, cx + 10 * scaleFactor, cy - 35 * scaleFactor);
            skinGrad.addColorStop(0.00, `rgba(194, 152, 118, ${0.98 * transformProgress})`);
            skinGrad.addColorStop(0.25, `rgba(164, 120, 90, ${0.98 * transformProgress})`);
            skinGrad.addColorStop(0.60, `rgba(128, 87, 60, ${0.98 * transformProgress})`);
            skinGrad.addColorStop(0.85, `rgba(98, 63, 42, ${0.96 * transformProgress})`);
            skinGrad.addColorStop(1.00, `rgba(72, 42, 28, ${0.94 * transformProgress})`);
            const hairHeadX = cx;
            const hairHeadY = cy - 54 * scaleFactor;

            // Atualizar física dos cachos do cabelo
            hairClusters.forEach(c => {
                const targetGX = hairHeadX + c.lx * scaleFactor;
                const targetGY = hairHeadY + c.ly * scaleFactor;

                if (c.x === 0 && c.y === 0) {
                    c.x = targetGX;
                    c.y = targetGY;
                }

                const dx = targetGX - c.x;
                const dy = targetGY - c.y;

                // Física original: mola + amortecimento
                const ax = dx * 0.055 - c.vx * 0.11;
                const ay = dy * 0.055 - c.vy * 0.11;

                // Oscilação suave individual
                const curlTime = time * 0.0013 + (c.lx + c.ly) * 0.05;
                const waveX = Math.sin(curlTime) * 0.7;
                const waveY = Math.cos(curlTime * 0.8) * 0.7;

                c.vx += ax;
                c.vy += ay;

                c.x += c.vx + waveX;
                c.y += c.vy + waveY;
            });

            // 1. DESENHAR CAMADA TRASEIRA E VOLUMÉTRICA DO CABELO (Fundo escuro e denso por trás da cabeça/corpo)
            hairClusters.forEach(c => {
                // Base escura do cacho para criar o contraste e preencher o fundo

            });

            // 2. DESENHAR CAMADA TRASEIRA DO VESTIDO (Profundidade drapeada atrás das pernas)
            ctx.fillStyle = `rgba(185, 170, 140, ${0.06 * transformProgress})`;
            ctx.beginPath();
            ctx.moveTo(cx - 10 * scaleFactor, cy - 25 * scaleFactor);
            ctx.bezierCurveTo(cx - 24 * scaleFactor, cy + 10 * scaleFactor, cx - 32 * scaleFactor, cy + 28 * scaleFactor, cx - 32 * scaleFactor, cy + 42 * scaleFactor);
            // Barra ondulada
            for (let j = 0; j <= 8; j++) {
                const pct = j / 8;
                const xOffset = -32 + 64 * pct;
                const wave = Math.sin(time * 0.0016 + pct * Math.PI * 2) * 5 * scaleFactor;
                ctx.lineTo(cx + xOffset * scaleFactor, cy + (42 + wave) * scaleFactor);
            }
            ctx.bezierCurveTo(cx + 32 * scaleFactor, cy + 28 * scaleFactor, cx + 24 * scaleFactor, cy + 10 * scaleFactor, cx + 10 * scaleFactor, cy - 25 * scaleFactor);
            ctx.closePath();
            ctx.fill();

            // 3. DESENHAR PERNAS ANATÔMICAS
            // Perna Esquerda
            const leftHipX = cx - 5.5 * scaleFactor;
            const leftHipY = cy + 18 * scaleFactor;
            const thighLength = 17 * scaleFactor;
            const calfLength = 16 * scaleFactor;

            const leftThighAngle = Math.PI * 0.49 + Math.sin(time * 0.0018) * 0.06;
            const leftKneeX = leftHipX + Math.cos(leftThighAngle) * thighLength;
            const leftKneeY = leftHipY + Math.sin(leftThighAngle) * thighLength;

            const leftCalfAngle = Math.PI * 0.52 + Math.sin(time * 0.0018 - 0.4) * 0.08;
            const leftAnkleX = leftKneeX + Math.cos(leftCalfAngle) * calfLength;
            const leftAnkleY = leftKneeY + Math.sin(leftCalfAngle) * calfLength;

            // Desenhar Coxa Esquerda (Tapered)
            ctx.fillStyle = skinGrad;
            ctx.beginPath();
            let angleT = Math.atan2(leftKneeY - leftHipY, leftKneeX - leftHipX);
            let perpTX = Math.sin(angleT);
            let perpTY = -Math.cos(angleT);
            ctx.moveTo(leftHipX - perpTX * 4.0 * scaleFactor, leftHipY - perpTY * 4.0 * scaleFactor);
            ctx.lineTo(leftKneeX - perpTX * 2.8 * scaleFactor, leftKneeY - perpTY * 2.8 * scaleFactor);
            ctx.lineTo(leftKneeX + perpTX * 2.8 * scaleFactor, leftKneeY + perpTY * 2.8 * scaleFactor);
            ctx.lineTo(leftHipX + perpTX * 4.0 * scaleFactor, leftHipY + perpTY * 4.0 * scaleFactor);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = `rgba(40, 20, 8, ${0.25 * transformProgress})`;
            ctx.lineWidth = 0.6 * scaleFactor;
            ctx.stroke();

            // Desenhar Panturrilha Esquerda (Tapered)
            ctx.beginPath();
            let angleC = Math.atan2(leftAnkleY - leftKneeY, leftAnkleX - leftKneeX);
            let perpCX = Math.sin(angleC);
            let perpCY = -Math.cos(angleC);
            ctx.moveTo(leftKneeX - perpCX * 2.8 * scaleFactor, leftKneeY - perpCY * 2.8 * scaleFactor);
            ctx.lineTo(leftAnkleX - perpCX * 1.6 * scaleFactor, leftAnkleY - perpCY * 1.6 * scaleFactor);
            ctx.lineTo(leftAnkleX + perpCX * 1.6 * scaleFactor, leftAnkleY + perpCY * 1.6 * scaleFactor);
            ctx.lineTo(leftKneeX + perpCX * 2.8 * scaleFactor, leftKneeY + perpCY * 2.8 * scaleFactor);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = `rgba(40, 20, 8, ${0.25 * transformProgress})`;
            ctx.lineWidth = 0.6 * scaleFactor;
            ctx.stroke();
            const rightHipX = cx + 5.5 * scaleFactor;
            const rightHipY = cy + 18 * scaleFactor;

            const rightThighAngle = Math.PI * 0.47 + Math.sin(time * 0.0018 + 0.5) * 0.06;
            const rightKneeX = rightHipX + Math.cos(rightThighAngle) * thighLength;
            const rightKneeY = rightHipY + Math.sin(rightThighAngle) * thighLength;

            const rightCalfAngle = Math.PI * 0.50 + Math.sin(time * 0.0018 + 0.1) * 0.08;
            const rightAnkleX = rightKneeX + Math.cos(rightCalfAngle) * calfLength;
            const rightAnkleY = rightKneeY + Math.sin(rightCalfAngle) * calfLength;

            // Desenhar Coxa Direita
            ctx.beginPath();
            angleT = Math.atan2(rightKneeY - rightHipY, rightKneeX - rightHipX);
            perpTX = Math.sin(angleT);
            perpTY = -Math.cos(angleT);
            ctx.moveTo(rightHipX - perpTX * 4.0 * scaleFactor, rightHipY - perpTY * 4.0 * scaleFactor);
            ctx.lineTo(rightKneeX - perpTX * 2.8 * scaleFactor, rightKneeY - perpTY * 2.8 * scaleFactor);
            ctx.lineTo(rightKneeX + perpTX * 2.8 * scaleFactor, rightKneeY + perpTY * 2.8 * scaleFactor);
            ctx.lineTo(rightHipX + perpTX * 4.0 * scaleFactor, rightHipY + perpTY * 4.0 * scaleFactor);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = `rgba(40, 20, 8, ${0.25 * transformProgress})`;
            ctx.lineWidth = 0.6 * scaleFactor;
            ctx.stroke();

            // Desenhar Panturrilha Direita
            ctx.beginPath();
            angleC = Math.atan2(rightAnkleY - rightKneeY, rightAnkleX - rightKneeX);
            perpCX = Math.sin(angleC);
            perpCY = -Math.cos(angleC);
            ctx.moveTo(rightKneeX - perpCX * 2.8 * scaleFactor, rightKneeY - perpCY * 2.8 * scaleFactor);
            ctx.lineTo(rightAnkleX - perpCX * 1.6 * scaleFactor, rightAnkleY - perpCY * 1.6 * scaleFactor);
            ctx.lineTo(rightAnkleX + perpCX * 1.6 * scaleFactor, rightAnkleY + perpCY * 1.6 * scaleFactor);
            ctx.lineTo(rightKneeX + perpCX * 2.8 * scaleFactor, rightKneeY + perpCY * 2.8 * scaleFactor);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = `rgba(40, 20, 8, ${0.25 * transformProgress})`;
            ctx.lineWidth = 0.6 * scaleFactor;
            ctx.stroke();

            // Botas de Exploradora (Brancas translúcidas starlit)
            ctx.fillStyle = `rgba(42, 46, 58, ${0.95 * transformProgress})`;
            // Bota Esquerda
            ctx.beginPath();

            ctx.moveTo(
                leftAnkleX - perpCX * 2.5 * scaleFactor,
                leftAnkleY - perpCY * 2.5 * scaleFactor
            );

            ctx.lineTo(
                leftAnkleX + perpCX * 2.5 * scaleFactor,
                leftAnkleY + perpCY * 2.5 * scaleFactor
            );

            let footTipX = leftAnkleX + Math.cos(leftCalfAngle + 0.3) * 8 * scaleFactor;
            let footTipY = leftAnkleY + Math.sin(leftCalfAngle + 0.3) * 8 * scaleFactor;

            const bootGradient = ctx.createLinearGradient(
    leftAnkleX,
    leftAnkleY,
    footTipX,
    footTipY
);

bootGradient.addColorStop(0, "rgba(65, 80, 120, 0.95)");
bootGradient.addColorStop(0.5, "rgba(38, 47, 68, 0.96)");
bootGradient.addColorStop(1, "rgba(14, 18, 30, 0.98)");

ctx.fillStyle = bootGradient;

            // Ponta arredondada
            ctx.quadraticCurveTo(
                footTipX + perpCX * 1.0 * scaleFactor,
                footTipY + perpCY * 1.0 * scaleFactor,

                footTipX - perpCX * 1.8 * scaleFactor,
                footTipY - perpCY * 1.8 * scaleFactor
            );

            ctx.closePath();
            ctx.fill();

            // Bota Direita
            ctx.beginPath();

            ctx.moveTo(
                rightAnkleX - perpCX * 2.5 * scaleFactor,
                rightAnkleY - perpCY * 2.5 * scaleFactor
            );

            ctx.lineTo(
                rightAnkleX + perpCX * 2.5 * scaleFactor,
                rightAnkleY + perpCY * 2.5 * scaleFactor
            );

            footTipX = rightAnkleX + Math.cos(rightCalfAngle + 0.3) * 8 * scaleFactor;
            footTipY = rightAnkleY + Math.sin(rightCalfAngle + 0.3) * 8 * scaleFactor;

            const bootGradientRight = ctx.createLinearGradient(
    rightAnkleX,
    rightAnkleY,
    footTipX,
    footTipY
);

bootGradientRight.addColorStop(0, "rgba(65, 80, 120, 0.95)");
bootGradientRight.addColorStop(0.5, "rgba(38, 47, 68, 0.96)");
bootGradientRight.addColorStop(1, "rgba(14, 18, 30, 0.98)");

ctx.fillStyle = bootGradientRight;

            // Ponta arredondada
            ctx.quadraticCurveTo(
                footTipX + perpCX * 1.0 * scaleFactor,
                footTipY + perpCY * 1.0 * scaleFactor,

                footTipX - perpCX * 1.8 * scaleFactor,
                footTipY - perpCY * 1.8 * scaleFactor
            );

            ctx.closePath();
            ctx.fill();

            // 4. DESENHAR CAMADA PRINCIPAL DO VESTIDO FLUIDO
            ctx.beginPath();
            ctx.moveTo(cx - 8 * scaleFactor, cy - 35 * scaleFactor); // Ombro esquerdo
            ctx.bezierCurveTo(cx - 15 * scaleFactor, cy - 10 * scaleFactor, cx - 26 * scaleFactor, cy + 5 * scaleFactor, cx - 26 * scaleFactor, cy + 22 * scaleFactor); // Lateral esquerda
            // Barra ondulada (Drapeado fluido)
            for (let j = 0; j <= 10; j++) {
                const pct = j / 10;
                const xOffset = -26 + 52 * pct;
                const wave = Math.sin(time * 0.0022 + pct * Math.PI * 1.5) * 4 * scaleFactor;
                ctx.lineTo(cx + xOffset * scaleFactor, cy + (22 + wave) * scaleFactor);
            }
            ctx.bezierCurveTo(cx + 26 * scaleFactor, cy + 5 * scaleFactor, cx + 15 * scaleFactor, cy - 10 * scaleFactor, cx + 8 * scaleFactor, cy - 35 * scaleFactor); // Lateral direita
            ctx.closePath();

            const dressGrad = ctx.createLinearGradient(cx - 20 * scaleFactor, cy - 35 * scaleFactor, cx + 20 * scaleFactor, cy + 25 * scaleFactor);
            dressGrad.addColorStop(0, `rgba(90, 90, 95, ${0.95 * transformProgress})`);
            dressGrad.addColorStop(0.35, `rgba(38, 38, 44, ${0.92 * transformProgress})`);
            dressGrad.addColorStop(0.75, `rgba(12, 12, 18, ${0.95 * transformProgress})`);
            dressGrad.addColorStop(1, `rgba(0, 0, 0, ${0.98 * transformProgress})`);

            ctx.fillStyle = dressGrad;
            ctx.fill();

            // Rim light brilhante no vestido
            ctx.fillStyle = `rgba(132, 102, 82, ${0.30 * transformProgress})`;
            ctx.lineWidth = 1.2 * scaleFactor;
            ctx.stroke();

            // Dobras drapeadas verticais internas do vestido
            ctx.fillStyle = `rgba(235, 210, 120, ${0.72 * transformProgress})`;
            ctx.lineWidth = 0.9 * scaleFactor;
            for (let f = 1; f < 5; f++) {
                const fpct = f / 5;
                const startX = cx + (-8 + 16 * fpct) * scaleFactor;
                const endX = cx + (-26 + 52 * fpct) * scaleFactor;
                const wave = Math.sin(time * 0.0022 + fpct * Math.PI * 1.5) * 4 * scaleFactor;
                ctx.beginPath();
                ctx.moveTo(startX, cy - 35 * scaleFactor);
                ctx.quadraticCurveTo(cx + (-10 + 20 * fpct) * scaleFactor, cy - 5 * scaleFactor, endX, cy + (22 + wave) * scaleFactor);
                ctx.stroke();
            }

            // 5. PESCOÇO E OMBROS
            ctx.fillStyle = skinGrad;
            ctx.beginPath();
            ctx.moveTo(cx - 3.5 * scaleFactor, cy - 43 * scaleFactor);
            ctx.lineTo(cx + 3.5 * scaleFactor, cy - 44 * scaleFactor);
            ctx.lineTo(cx + 4.5 * scaleFactor, cy - 35 * scaleFactor);
            ctx.lineTo(cx - 6 * scaleFactor, cy - 35 * scaleFactor);
            ctx.closePath();
            ctx.fill();

            // 6. CABEÇA / NUCA (Vista de costas para dar protagonismo ao cabelo cósmico)
            const faceY = cy - 53 * scaleFactor;

            ctx.fillStyle = skinGrad;
            ctx.beginPath();
            ctx.arc(cx - 3 * scaleFactor, faceY + 3 * scaleFactor, 9.5 * scaleFactor, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();

            // Iluminação refletida de contorno (Rim light azul celeste/lilás de nuca)
            ctx.strokeStyle = `rgba(145, 151, 190, ${0.48 * transformProgress})`;
            ctx.lineWidth = 1.0 * scaleFactor;
            ctx.stroke();

            // 7. DESENHAR DETALHES E VOLUMES FRONTAIS DO CABELO (Cabelo volumoso cobrindo a cabeça e ombros)
            hairClusters.forEach(c => {
                // Gradiente radial da mecha colorida para dar o brilho de nebulosa em primeiro plano
                const gradHighlight = ctx.createRadialGradient(
                    c.x - c.radius * 0.25 * scaleFactor,
                    c.y - c.radius * 0.25 * scaleFactor,
                    1,
                    c.x,
                    c.y,
                    c.radius * scaleFactor * 0.85
                );

                gradHighlight.addColorStop(0.00, `rgba(250, 248, 245, ${0.30 * transformProgress})`);
                gradHighlight.addColorStop(0.35, `rgba(236, 232, 226, ${0.25 * transformProgress})`);
                gradHighlight.addColorStop(0.70, `rgba(228, 223, 214, ${0.17 * transformProgress})`);
                gradHighlight.addColorStop(1.00, `rgba(205, 198, 188, 0)`);

                ctx.fillStyle = gradHighlight;

                ctx.beginPath();
                ctx.arc(
                    c.x,
                    c.y,
                    c.radius * scaleFactor * 0.85,
                    0,
                    Math.PI * 2
                );
                ctx.fill();

                // Fios em espirais finas para acabamento cacheado volumoso
                c.spiralOffsets.forEach(sp => {
                    sp.phase += sp.rotSpeed;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${c.color}, ${0.38 * transformProgress})`;
                    ctx.lineWidth = 0.75 * scaleFactor;
                    const spiralRadius = c.radius * 0.72 * sp.scale * scaleFactor;
                    const maxTheta = Math.PI * 2.5;

                    for (let theta = 0; theta < maxTheta; theta += 0.22) {
                        const curR = (spiralRadius * theta) / maxTheta;
                        const angle = sp.direction * theta + sp.phase + floatTilt;
                        const hx = c.x + Math.cos(angle) * curR;
                        const hy = c.y + Math.sin(angle) * curR;

                        if (theta === 0) ctx.moveTo(hx, hy);
                        else ctx.lineTo(hx, hy);
                    }
                    ctx.stroke();
                });

                // Estrelas cintilantes internas nas constelações do cabelo
                c.starTwinkle += c.starSpeed;
                const starAlpha = (0.16 + 0.56 * Math.sin(c.starTwinkle)) * transformProgress;
                if (starAlpha > 0.3) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha * 0.68})`;
                    const sx = c.x + Math.sin(c.starTwinkle) * c.radius * 0.35;
                    const sy = c.y + Math.cos(c.starTwinkle) * c.radius * 0.35;
                    ctx.fillRect(sx, sy, c.starSize * scaleFactor, c.starSize * scaleFactor);
                }
            });

            // Braço removido: presença invisível da mão (ver efeito abaixo após ctx.restore)

            // 9. CINEMÁTICA INVERSA (IK) DO BRAÇO DIREITO (INDICADOR, VOLUMÉTRICO)
            finX += (localTargetX - finX) * 0.085;
            finY += (localTargetY - finY) * 0.085;

            // Limita o alcance do braço: o punho nunca pode ultrapassar 2x o comprimento do braço
            // (evita o "braço gigante" / haste que cruza a tela)
            const armReachLimit = 55 * scaleFactor * 1.9;
            const reachDx = finX - shX;
            const reachDy = finY - shY;
            const reachDist = Math.sqrt(reachDx * reachDx + reachDy * reachDy) || 1;
            if (reachDist > armReachLimit) {
                finX = shX + (reachDx / reachDist) * armReachLimit;
                finY = shY + (reachDy / reachDist) * armReachLimit;
            }

            const dx = finX - shX;
            const dy = finY - shY;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const midX = (shX + finX) / 2;
            const midY = (shY + finY) / 2;

            const nx = -dy / dist;
            const ny = dx / dist;
            const armLength = 55 * scaleFactor;
            const bend = Math.max(0, Math.sqrt(Math.max(0, (armLength * 2) * (armLength * 2) - (dist / 2) * (dist / 2))));

            const elX = midX + nx * bend * 0.35 - 5 * scaleFactor;
            const elY = midY + ny * bend * 0.35 + 10 * scaleFactor;

            // Braço direito removido: a personagem ativa os ícones por proximidade


            // Pequena estrela na ponta do vestido
            const starPulse = 0.6 + 0.4 * Math.sin(time * 0.002);
            ctx.fillStyle = `rgba(255, 255, 255, ${starPulse * transformProgress})`;
            ctx.beginPath();
            ctx.arc(cx - 3 * scaleFactor, cy + 12 * scaleFactor, 1.2 * scaleFactor, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        drawFarewellParticles(time);

        // ================================================================
        // PRESENÇA DA MÃO INVISÍVEL
        // Impressões de calor de dedos no ícone, como uma mão espiritual
        // pressionando vidro. Não é visível, mas é sentida.
        // ================================================================
        if (autopilotState === "touching" && transformProgress > 0.8) {
            phantomTouchAlpha = Math.min(1, phantomTouchAlpha + 0.04);
        } else {
            phantomTouchAlpha = Math.max(0, phantomTouchAlpha - 0.025);
        }

        if (phantomTouchAlpha > 0.01) {
            // ── SOL DOURADO: halo difuso + núcleo + raios ──
            const pulse = 0.88 + 0.12 * Math.sin(time * 0.010);
            const sunR = 10 * scaleFactor * pulse;

            // 1. Halo externo difuso (âmbar suave, quase transparente)
            const outerGrd = ctx.createRadialGradient(targetX, targetY, 0, targetX, targetY, sunR * 2.1);
            outerGrd.addColorStop(0, `rgba(255, 210, 60,  ${phantomTouchAlpha * 0.12})`);
            outerGrd.addColorStop(0.38, `rgba(255, 175, 20,  ${phantomTouchAlpha * 0.14})`);
            outerGrd.addColorStop(0.72, `rgba(255, 140, 10,  ${phantomTouchAlpha * 0.05})`);
            outerGrd.addColorStop(1, `rgba(255, 120,  0,  0)`);
            ctx.fillStyle = outerGrd;
            ctx.beginPath();
            ctx.arc(targetX, targetY, sunR * 2.0, 0, Math.PI * 2);
            ctx.fill();


            // 3. Núcleo brilhante central (branco → dourado)
            const coreGrd = ctx.createRadialGradient(targetX, targetY, 0, targetX, targetY, sunR * 0.75);
            coreGrd.addColorStop(0, `rgba(255, 255, 255, ${phantomTouchAlpha * 0.45})`);
            coreGrd.addColorStop(0.3, `rgba(255, 245, 160, ${phantomTouchAlpha * 0.30})`);
            coreGrd.addColorStop(0.7, `rgba(255, 210,  60, ${phantomTouchAlpha * 0.12})`);
            coreGrd.addColorStop(1, `rgba(255, 170,  20, 0)`);
            ctx.fillStyle = coreGrd;
            ctx.beginPath();
            ctx.arc(targetX, targetY, sunR * 0.75, 0, Math.PI * 2);
            ctx.fill();


        }


        // Partículas de reações visuais atrás da personagem já terminaram aqui.

        // 11. Atualizar e desenhar partículas de reações visuais (Global)
        for (let i = reactionParticles.length - 1; i >= 0; i--) {
            const p = reactionParticles[i];
            if (p.type === "orbit") {
                p.angle += p.angularSpeed;
                p.radius += (p.maxRadius - p.radius) * 0.08;
                const px = p.x + Math.cos(p.angle) * p.radius;
                const py = p.y + Math.sin(p.angle) * p.radius;
                ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
                ctx.beginPath();
                ctx.arc(px, py, p.size, 0, Math.PI * 2);
                ctx.fill();
                p.alpha -= p.decay;
                if (p.alpha <= 0) reactionParticles.splice(i, 1);
            } else if (p.type === "geom") {
                p.y += p.vy;
                p.rot += p.rotSpeed;
                ctx.strokeStyle = `rgba(${p.color}, ${p.alpha * 0.4})`;
                ctx.lineWidth = 1.0;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.beginPath();
                if (p.shape === "triangle") {
                    ctx.moveTo(0, -p.size);
                    ctx.lineTo(p.size, p.size * 0.7);
                    ctx.lineTo(-p.size, p.size * 0.7);
                    ctx.closePath();
                } else {
                    ctx.rect(-p.size / 2, -p.size / 2, p.size, p.size);
                }
                ctx.stroke();
                ctx.restore();
                p.alpha -= p.decay;
                if (p.alpha <= 0) reactionParticles.splice(i, 1);
            } else {
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= p.decay;
                if (p.alpha <= 0) {
                    reactionParticles.splice(i, 1);
                } else {
                    ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        // 12. Atualizar e desenhar linhas de reações visuais (Global)
        for (let i = reactionLines.length - 1; i >= 0; i--) {
            const line = reactionLines[i];
            if (line.type === "ripple") {
                line.radius += line.speed;
                line.alpha = 1.0 - (line.radius / line.maxRadius);
                if (line.alpha <= 0) {
                    reactionLines.splice(i, 1);
                } else {
                    ctx.strokeStyle = `rgba(${line.color}, ${line.alpha * 0.65})`;
                    ctx.lineWidth = 1.8;
                    ctx.beginPath();
                    ctx.arc(line.x, line.y, line.radius, 0, Math.PI * 2);
                    ctx.stroke();
                }
            } else if (line.type === "pulse") {
                line.radius += line.speed;
                line.alpha = 1.0 - (line.radius / line.maxRadius);
                if (line.alpha <= 0) {
                    reactionLines.splice(i, 1);
                } else {
                    ctx.fillStyle = `rgba(${line.color}, ${line.alpha * 0.16})`;
                    ctx.beginPath();
                    ctx.arc(line.x, line.y, line.radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = `rgba(${line.color}, ${line.alpha * 0.75})`;
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.arc(line.x, line.y, line.radius, 0, Math.PI * 2);
                    ctx.stroke();
                }
            } else if (line.type === "box") {
                line.w += line.speed * 2.2;
                line.h += line.speed * 1.1;
                line.alpha = 1.0 - (line.w / line.maxW);
                if (line.alpha <= 0) {
                    reactionLines.splice(i, 1);
                } else {
                    ctx.strokeStyle = `rgba(${line.color}, ${line.alpha * 0.5})`;
                    ctx.lineWidth = 1.1;
                    ctx.strokeRect(line.x - line.w / 2, line.y - line.h / 2, line.w, line.h);
                }
            } else if (line.type === "spark") {
                const lastPt = line.points[line.points.length - 1];
                if (line.points.length < 5 && Math.random() < 0.65) {
                    const angle = Math.random() * Math.PI * 2;
                    const dist = 14 + Math.random() * 12;
                    line.points.push({
                        x: lastPt.x + Math.cos(angle) * dist,
                        y: lastPt.y + Math.sin(angle) * dist
                    });
                }
                ctx.strokeStyle = `rgba(${line.color}, ${line.alpha})`;
                ctx.lineWidth = 1.4;
                ctx.beginPath();
                ctx.moveTo(line.points[0].x, line.points[0].y);
                for (let j = 1; j < line.points.length; j++) {
                    ctx.lineTo(line.points[j].x, line.points[j].y);
                }
                ctx.stroke();
                line.alpha -= line.decay;
                if (line.alpha <= 0) reactionLines.splice(i, 1);
            } else if (line.type === "tree") {
                if (line.length < line.maxLength) {
                    line.length += 1.8;
                }
                const endY = line.y - line.length;
                ctx.strokeStyle = `rgba(${line.color}, ${line.alpha})`;
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.moveTo(line.x, line.y);
                ctx.lineTo(line.x, endY);
                ctx.stroke();
                ctx.fillStyle = `rgba(${line.color}, ${line.alpha})`;
                ctx.beginPath();
                ctx.arc(line.x, endY, 3.5, 0, Math.PI * 2);
                ctx.fill();
                if (line.length > 25 && line.branches.length === 0) {
                    line.branches.push({ x: line.x, y: line.y - 25, endX: line.x - 22, endY: line.y - 45, len: 0 });
                    line.branches.push({ x: line.x, y: line.y - 25, endX: line.x + 22, endY: line.y - 45, len: 0 });
                }
                line.branches.forEach(b => {
                    if (b.len < 1.0) b.len += 0.045;
                    const bx = b.x + (b.endX - b.x) * b.len;
                    const by = b.y + (b.endY - b.y) * b.len;
                    ctx.beginPath();
                    ctx.moveTo(b.x, b.y);
                    ctx.lineTo(bx, by);
                    ctx.stroke();
                    if (b.len >= 0.95) {
                        ctx.beginPath();
                        ctx.arc(b.endX, b.endY, 2.5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
                line.alpha -= 0.01;
                if (line.alpha <= 0) reactionLines.splice(i, 1);
            } else if (line.type === "link") {
                if (line.progress < 1.0) {
                    line.progress += 0.045;
                }
                const curX = line.x1 + (line.x2 - line.x1) * line.progress;
                const curY = line.y1 + (line.y2 - line.y1) * line.progress;
                ctx.strokeStyle = `rgba(${line.color}, ${line.alpha * 0.45})`;
                ctx.lineWidth = 1.0;
                ctx.beginPath();
                ctx.moveTo(line.x1, line.y1);
                ctx.lineTo(curX, curY);
                ctx.stroke();
                ctx.fillStyle = `rgba(${line.color}, ${line.alpha})`;
                ctx.beginPath();
                ctx.arc(curX, curY, 2.5, 0, Math.PI * 2);
                ctx.fill();
                line.alpha -= 0.014;
                if (line.alpha <= 0) reactionLines.splice(i, 1);
            } else if (line.type === "gemini_wave") {
                line.radius += line.speed;
                line.alpha = 1.0 - (line.radius / line.maxRadius);
                if (line.alpha <= 0) {
                    reactionLines.splice(i, 1);
                } else {
                    ctx.strokeStyle = `rgba(${line.color1}, ${line.alpha * 0.55})`;
                    ctx.lineWidth = 1.6;
                    ctx.beginPath();
                    ctx.arc(line.x, line.y, line.radius, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.strokeStyle = `rgba(${line.color2}, ${line.alpha * 0.35})`;
                    ctx.lineWidth = 1.0;
                    ctx.beginPath();
                    for (let a = 0; a < Math.PI * 2; a += 0.08) {
                        const distPct = line.radius + Math.sin(a * 8 + time * 0.005) * 8 * line.alpha;
                        const wx = line.x + Math.cos(a) * distPct;
                        const wy = line.y + Math.sin(a) * distPct;
                        if (a === 0) ctx.moveTo(wx, wy);
                        else ctx.lineTo(wx, wy);
                    }
                    ctx.closePath();
                    ctx.stroke();
                }
            }
        }

        animationId = requestAnimationFrame(animate);
    }

    function animate(time) {
        tick(time);
    }

    // IntersectionObserver para suspender o canvas se não estiver visível
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
                // Resetar o cronômetro para o fade-in e limpar as teclas carregadas
                introStartTime = performance.now();
                buttons.forEach(btn => {
                    btn.classList.remove("tech-charged");
                    btn.classList.remove("autopilot-hover");
                });
                panel.classList.remove("cinematic-glow");
                farewellParticles.length = 0;
                autopilotIndex = 0;
                autopilotState = "resting";

                // Força o redimensionamento do canvas ao entrar em cena para obter as medidas reais imediatamente
                resizeCanvas();

                if (!animationId) {
                    animate(performance.now());
                }
            } else {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
        });
    }, { threshold: 0.01 });

    observer.observe(section);

    window.addEventListener("resize", resizeCanvas);

    resizeCanvas();
}
