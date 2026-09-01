const POSTS_KEY = 'repara-coser-posts-v1';

const postForm = document.getElementById('postForm');
const postsContainer = document.getElementById('posts');
const clearBtn = document.getElementById('clearPosts');

const problemaSel = document.getElementById('problema');
const diagnosticarBtn = document.getElementById('diagnosticar');
const resultadoIA = document.getElementById('resultadoIA');

function getPosts() {
  try {
    return JSON.parse(localStorage.getItem(POSTS_KEY) || '[]');
  } catch {
    return [];
  }
}

function savePosts(posts) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

function tipoClass(tipo) {
  if (tipo === 'Pregunta') return 'q';
  if (tipo === 'Queja') return 'c';
  return 'a';
}

function renderPosts() {
  const posts = getPosts();
  if (!posts.length) {
    postsContainer.innerHTML = '<article class="card post"><p class="muted">Aún no hay publicaciones. Sé la primera persona en publicar una pregunta o queja.</p></article>';
    return;
  }

  postsContainer.innerHTML = posts
    .slice()
    .reverse()
    .map((p) => `
      <article class="card post">
        <div class="meta">
          <span class="tag ${tipoClass(p.tipo)}">${p.tipo}</span>
          <strong>${escapeHtml(p.nombre)}</strong> · ${new Date(p.fecha).toLocaleString('es-MX')}
          ${p.modelo ? ` · <em>${escapeHtml(p.modelo)}</em>` : ''}
        </div>
        <p>${escapeHtml(p.mensaje)}</p>
      </article>
    `)
    .join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}

postForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const tipo = document.getElementById('tipo').value;
  const modelo = document.getElementById('modelo').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();

  if (!nombre || !tipo || !mensaje) return;

  const posts = getPosts();
  posts.push({ nombre, tipo, modelo, mensaje, fecha: new Date().toISOString() });
  savePosts(posts);
  postForm.reset();
  renderPosts();
});

clearBtn?.addEventListener('click', () => {
  if (!confirm('¿Seguro que quieres borrar todas las publicaciones locales?')) return;
  localStorage.removeItem(POSTS_KEY);
  renderPosts();
});

const diagnosticos = {
  salta_puntadas: {
    title: 'Diagnóstico: Salta puntadas',
    pasos: [
      'Cambia la aguja por una nueva (tipo y calibre correcto).',
      'Verifica que la aguja esté bien colocada (altura y orientación).',
      'Revisa sincronización gancho-aguja.',
      'Confirma tensión del hilo superior e inferior.',
      'Prueba con otro hilo (calidad y grosor adecuados).'
    ]
  },
  rompe_hilo: {
    title: 'Diagnóstico: Rompe hilo',
    pasos: [
      'Revisa rebabas en aguja, placa y gancho.',
      'Baja un poco la tensión del hilo superior.',
      'Confirma enhebrado correcto en toda la ruta.',
      'Verifica compatibilidad hilo-aguja-material.',
      'Revisa si hay sobrecalentamiento o suciedad en tensor.'
    ]
  },
  no_arrastra: {
    title: 'Diagnóstico: No arrastra la tela',
    pasos: [
      'Ajusta presión del prensatelas.',
      'Revisa altura y desgaste de los dientes de arrastre.',
      'Confirma largo de puntada mayor a cero.',
      'Limpia pelusa debajo de placa de aguja.',
      'Verifica sincronización del mecanismo de arrastre.'
    ]
  },
  ruido: {
    title: 'Diagnóstico: Ruido excesivo',
    pasos: [
      'Lubrica puntos recomendados por el fabricante.',
      'Revisa tornillos flojos en tapa, barra y motor.',
      'Inspecciona banda/correa y poleas.',
      'Verifica juego en eje principal y bielas.',
      'Detén uso si hay golpeteo metálico fuerte.'
    ]
  },
  no_enciende: {
    title: 'Diagnóstico: No enciende / motor falla',
    pasos: [
      'Verifica toma eléctrica y cable de alimentación.',
      'Revisa interruptor y fusible.',
      'Comprueba pedal/servo (conectores y señal).',
      'Observa si hay olor a quemado o recalentamiento.',
      'Si persiste, requiere revisión eléctrica técnica.'
    ]
  },
  aceite: {
    title: 'Diagnóstico: Fuga o falta de aceite',
    pasos: [
      'Confirma nivel correcto (ni exceso ni mínimo).',
      'Revisa empaques y sellos visibles.',
      'Usa el aceite recomendado para tu modelo.',
      'Limpia conductos/tubos y verifica obstrucciones.',
      'No operar en seco: puede dañar componentes.'
    ]
  }
};

function renderDiagnostico() {
  const key = problemaSel.value;
  if (!key || !diagnosticos[key]) {
    resultadoIA.className = 'result';
    resultadoIA.innerHTML = '<p class="muted">Selecciona un síntoma para recibir orientación.</p>';
    return;
  }

  const { title, pasos } = diagnosticos[key];
  resultadoIA.className = 'result ok';
  resultadoIA.innerHTML = `
    <h3>${title}</h3>
    <ol>${pasos.map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ol>
    <p><strong>Nota:</strong> Esto es una guía inicial. Para ajuste fino de tiempo/sincronización, consulta técnico calificado.</p>
  `;
}

diagnosticarBtn?.addEventListener('click', renderDiagnostico);

renderPosts();
renderDiagnostico();
