const eye = document.querySelector('.eye');
const pupil = document.querySelectorAll('.pupil');

document.addEventListener('mousemove', (e) => {
  const eyeRect = eye.getBoundingClientRect();
  const eyeCenterX = eyeRect.left + eyeRect.width / 2;
  const eyeCenterY = eyeRect.top + eyeRect.height / 2;

  const mouseX = e.clientX;
  const mouseY = e.clientY;

  // 각도 계산
  const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);

  // 동공의 이동 범위
  const distance = Math.min(eyeRect.width / 4, eyeRect.height / 4);

  // 동공의 위치 계산
  const pupilX = distance * Math.cos(angle);
  const pupilY = distance * Math.sin(angle);

  // 동공 위치 변경
  pupil[0].style.transform = `translate(-50%, -50%) translate(${pupilX}px, ${pupilY}px)`;
  pupil[1].style.transform = `translate(-50%, -50%) translate(${pupilX}px, ${pupilY}px)`;
});
