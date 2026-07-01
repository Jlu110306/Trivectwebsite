import { useEffect, useRef } from 'react';

export default function RocketGamePage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Full 3D rocket flight game using raw Canvas 2D (no Three.js dep needed)
    const ctx = canvas.getContext('2d');
    let W, H;
    let animationId;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Stars
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * 2000 - 1000,
      y: Math.random() * 2000 - 1000,
      z: Math.random() * 2000 - 500,
      size: Math.random() * 2 + 0.5,
      brightness: Math.random() * 0.5 + 0.5
    }));

    // Rocket state
    const rocket = {
      x: 0, y: 0, z: 0,
      vx: 0, vy: 0, vz: 0,
      angle: 0, pitch: 0, roll: 0,
      thrust: 0, fuel: 100,
      altitude: 0, speed: 0,
      alive: true
    };

    // Controls
    const keys = {};
    let mouseDown = false;
    let mouseX = 0, mouseY = 0;

    window.addEventListener('keydown', e => { keys[e.key] = true; });
    window.addEventListener('keyup', e => { keys[e.key] = false; });
    canvas.addEventListener('mousedown', e => { mouseDown = true; mouseX = e.clientX; mouseY = e.clientY; });
    canvas.addEventListener('mousemove', e => { if (mouseDown) { mouseX = e.clientX; mouseY = e.clientY; } });
    canvas.addEventListener('mouseup', () => { mouseDown = false; });
    canvas.addEventListener('touchstart', e => { mouseDown = true; mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY; e.preventDefault(); });
    canvas.addEventListener('touchmove', e => { if (mouseDown) { mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY; } e.preventDefault(); });
    canvas.addEventListener('touchend', () => { mouseDown = false; });

    let lastTime = 0;
    let score = 0;
    let gameTime = 0;
    let particles = [];
    let rings = [];

    // Generate ring obstacles
    for (let i = 0; i < 15; i++) {
      rings.push({
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 600,
        z: -i * 200 - 200,
        radius: 40 + Math.random() * 40,
        collected: false
      });
    }

    function spawnParticle(x, y) {
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 8 - 4,
        life: 1, decay: 0.02 + Math.random() * 0.04,
        size: 1 + Math.random() * 3
      });
      if (particles.length > 300) particles = particles.slice(-200);
    }

    function project3D(x, y, z) {
      const scale = 400 / (400 + z);
      return {
        sx: W / 2 + x * scale,
        sy: H / 2 - y * scale,
        scale
      };
    }

    function drawRocket() {
      const { sx, sy, scale } = project3D(rocket.x, rocket.y, rocket.z);
      const angle = rocket.angle;
      const s = Math.max(scale * 0.8, 0.3);

      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(angle);
      ctx.scale(s, s);

      // Rocket body
      ctx.fillStyle = '#e0e0e0';
      ctx.beginPath();
      ctx.moveTo(0, -30);  // nose
      ctx.lineTo(10, 20);  // right body
      ctx.lineTo(14, 28);  // right fin bottom
      ctx.lineTo(6, 16);   // right fin top
      ctx.lineTo(0, 22);   // center bottom
      ctx.lineTo(-6, 16);  // left fin top
      ctx.lineTo(-14, 28); // left fin bottom
      ctx.lineTo(-10, 20); // left body
      ctx.closePath();
      ctx.fill();

      // Red stripe
      ctx.fillStyle = '#CC0000';
      ctx.fillRect(-6, -10, 12, 16);

      // Nose cone
      ctx.fillStyle = '#CC0000';
      ctx.beginPath();
      ctx.moveTo(0, -30);
      ctx.lineTo(7, -14);
      ctx.lineTo(-7, -14);
      ctx.closePath();
      ctx.fill();

      // Window
      ctx.fillStyle = '#4488cc';
      ctx.beginPath();
      ctx.arc(0, -4, 4, 0, Math.PI * 2);
      ctx.fill();

      // Window shine
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.arc(-1, -5, 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Thrust flame
      if (rocket.thrust > 0 && rocket.alive) {
        const flameLen = rocket.thrust * 20 + 10;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(angle);
        ctx.scale(s, s);

        const grad = ctx.createLinearGradient(0, 22, 0, 22 + flameLen);
        grad.addColorStop(0, '#FF8800');
        grad.addColorStop(0.3, '#FF4400');
        grad.addColorStop(0.7, '#CC0000');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(-5, 22);
        ctx.lineTo(5, 22);
        ctx.lineTo(0, 22 + flameLen);
        ctx.closePath();
        ctx.fill();

        // Inner flame
        const grad2 = ctx.createLinearGradient(0, 22, 0, 22 + flameLen * 0.6);
        grad2.addColorStop(0, '#FFFF88');
        grad2.addColorStop(0.5, '#FFAA00');
        grad2.addColorStop(1, 'transparent');
        ctx.fillStyle = grad2;
        ctx.beginPath();
        ctx.moveTo(-2, 22);
        ctx.lineTo(2, 22);
        ctx.lineTo(0, 22 + flameLen * 0.6);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        // Spawn particles
        const pAngle = angle + Math.PI / 2;
        for (let i = 0; i < 3; i++) {
          spawnParticle(
            sx + Math.cos(pAngle) * s * (Math.random() - 0.5) * 8,
            sy + Math.sin(pAngle) * s * (Math.random() - 0.5) * 8 + s * 22
          );
        }
      }

      return { sx, sy, s };
    }

    function drawStars() {
      stars.forEach(star => {
        const { sx, sy, scale } = project3D(star.x, star.y, star.z);
        if (sx < -50 || sx > W + 50 || sy < -50 || sy > H + 50) return;
        const alpha = star.brightness * Math.min(scale * 2, 1);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, star.size * scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // Move stars for parallax
      stars.forEach(star => { star.z += rocket.speed * 0.3; if (star.z > 1500) { star.z -= 3500; star.x = (Math.random() - 0.5) * 2000; star.y = (Math.random() - 0.5) * 2000; } });
    }

    function drawRings() {
      rings.forEach(ring => {
        const { sx, sy, scale } = project3D(ring.x, ring.y, ring.z);
        const r = ring.radius * scale;
        if (r < 2 || r > 300) return;

        ctx.strokeStyle = ring.collected ? 'rgba(0,255,0,0.3)' : 'rgba(255,200,50,0.8)';
        ctx.lineWidth = Math.max(1, 2 * scale);
        ctx.beginPath();
        ctx.ellipse(sx, sy, r, r * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Glow
        ctx.strokeStyle = ring.collected ? 'rgba(0,255,0,0.1)' : 'rgba(255,200,50,0.15)';
        ctx.lineWidth = Math.max(2, 6 * scale);
        ctx.beginPath();
        ctx.ellipse(sx, sy, r, r * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
      });
    }

    function drawParticles() {
      particles.forEach((p, i) => {
        ctx.fillStyle = `rgba(255,${Math.floor(150 + p.life * 100)},${Math.floor(p.life * 50)},${p.life})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function drawHUD() {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, W, 50);

      ctx.fillStyle = '#888';
      ctx.font = '10px monospace';
      ctx.fillText(`ALT: ${Math.floor(rocket.altitude * 10)}m`, 20, 18);
      ctx.fillText(`SPD: ${Math.floor(rocket.speed * 30)} m/s`, 20, 34);
      ctx.fillText(`FUEL: ${rocket.fuel.toFixed(0)}%`, 160, 18);
      ctx.fillText(`SCORE: ${score}`, 160, 34);
      ctx.fillText(`TIME: ${Math.floor(gameTime)}s`, 300, 18);

      // Fuel bar
      const fuelW = 100;
      ctx.fillStyle = '#333';
      ctx.fillRect(300, 24, fuelW, 8);
      ctx.fillStyle = rocket.fuel > 20 ? '#44aa44' : '#cc4444';
      ctx.fillRect(300, 24, fuelW * rocket.fuel / 100, 8);

      if (!rocket.alive) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#CC0000';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('MISSION FAILED', W / 2, H / 2 - 20);
        ctx.fillStyle = '#fff';
        ctx.font = '18px monospace';
        ctx.fillText(`Final Score: ${score} | Time: ${Math.floor(gameTime)}s`, W / 2, H / 2 + 20);
        ctx.fillText('Press R to restart', W / 2, H / 2 + 50);
        ctx.textAlign = 'start';
      }
    }

    function update(dt) {
      if (!rocket.alive) return;
      const d = Math.min(dt, 0.05);

      gameTime += d;

      // Controls
      if (keys['w'] || keys['ArrowUp']) rocket.pitch = Math.min(rocket.pitch + d * 3, 0.8);
      else if (keys['s'] || keys['ArrowDown']) rocket.pitch = Math.max(rocket.pitch - d * 3, -0.5);
      else rocket.pitch *= 0.95;

      if (keys['a'] || keys['ArrowLeft']) rocket.roll = Math.min(rocket.roll + d * 5, 1.2);
      else if (keys['d'] || keys['ArrowRight']) rocket.roll = Math.max(rocket.roll - d * 5, -1.2);
      else rocket.roll *= 0.9;

      rocket.thrust = (keys[' '] || keys['Shift'] || mouseDown) ? Math.min(rocket.thrust + d * 4, 1) : Math.max(rocket.thrust - d * 4, 0);

      if (rocket.thrust > 0 && rocket.fuel > 0) {
        rocket.fuel -= rocket.thrust * d * 8;
        rocket.vz -= rocket.thrust * 150 * d;
        rocket.vy += Math.sin(rocket.pitch) * rocket.thrust * 80 * d;
        rocket.vx += Math.sin(rocket.roll) * rocket.thrust * 80 * d;
      }

      // Gravity & drag
      rocket.vy -= 20 * d;
      rocket.vx *= 0.98;
      rocket.vy *= 0.98;
      rocket.vz *= 0.99;

      rocket.x += rocket.vx * d;
      rocket.y += rocket.vy * d;
      rocket.z += rocket.vz * d;

      rocket.speed = Math.sqrt(rocket.vx ** 2 + rocket.vy ** 2 + rocket.vz ** 2);
      rocket.altitude = -rocket.z;
      rocket.angle = Math.atan2(rocket.vx, -rocket.vz);

      // Ground collision
      if (rocket.z > 0) {
        if (rocket.vy < -30) rocket.alive = false;
        else { rocket.z = 0; rocket.vy = Math.max(0, rocket.vy); rocket.vz = 0; }
      }

      // Crater
      if (rocket.z > 50) rocket.alive = false;

      // Ring collection
      rings.forEach(ring => {
        if (ring.collected) return;
        const dx = rocket.x - ring.x;
        const dy = rocket.y - ring.y;
        const dz = rocket.z - ring.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < ring.radius * 0.5) {
          ring.collected = true;
          score += 100;
        }
        ring.z += rocket.speed * 0.3 * d;
        if (ring.z > 500) { ring.z -= 3000; ring.x = (Math.random() - 0.5) * 600; ring.y = (Math.random() - 0.5) * 600; ring.collected = false; }
      });

      // Update particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 2;
        p.life -= p.decay;
      });
      particles = particles.filter(p => p.life > 0);

      // Auto-score for altitude
      if (rocket.altitude > 0) score = Math.max(score, Math.floor(rocket.altitude));
    }

    function reset() {
      Object.assign(rocket, { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, angle: 0, pitch: 0, roll: 0, thrust: 0, fuel: 100, altitude: 0, speed: 0, alive: true });
      score = 0;
      gameTime = 0;
      particles = [];
      rings.forEach(r => { r.collected = false; r.z = -Math.random() * 2000 - 200; });
    }

    window.addEventListener('keydown', e => { if (e.key === 'r' || e.key === 'R') reset(); });

    function loop(time) {
      const dt = lastTime ? (time - lastTime) / 1000 : 0.016;
      lastTime = time;

      update(dt);

      ctx.fillStyle = '#08081a';
      ctx.fillRect(0, 0, W, H);

      drawStars();
      drawRings();
      drawParticles();
      drawRocket();
      drawHUD();

      animationId = requestAnimationFrame(loop);
    }

    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 100%; height: 100%; overflow: hidden; background: #08081a; }
        .rocket-game-canvas { display: block; width: 100vw; height: 100vh; position: fixed; top: 0; left: 0; }
        .game-hint { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 20; font-family: monospace; font-size: 12px; color: rgba(255,255,255,0.3); letter-spacing: 2px; text-align: center; }
      `}</style>
      <canvas ref={canvasRef} className="rocket-game-canvas" style={{ touchAction: 'none' }} />
      <div className="game-hint">WASD / Arrows = Steer | Space / Click = Thrust | R = Restart</div>
    </>
  );
}
