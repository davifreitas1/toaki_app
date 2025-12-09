// src/componentes/atomos/Icone.jsx
import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Calendar,
  Edit2,
  Home,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Star,
  Tag,
  User,
  X,
} from 'lucide-react';

const MAPA_ICONES = {
  retorno: ArrowLeft,      // seta para trás
  avanco: ArrowRight,      // seta para frente
  chat: MessageCircle,
  estrela: Star,
  fechar: X,
  lupa: Search,
  mapa: MapPin,
  tag: Tag,
  notas: Bell,
  telefone: Phone,
  usuario: User,
  home: Home,
  email: Mail,
  calendario: Calendar,
  editar: Edit2,
};

const Icone = ({
  path,
  tamanho = 24,
  cor = 'currentColor',
  aoClicar,
  className = '',
  ...rest
}) => {
  const LucideIcon = MAPA_ICONES[path];

  if (!LucideIcon) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Ícone "${path}" não mapeado em Icone.jsx`);
    }
    return null;
  }

  const Wrapper = aoClicar ? 'button' : 'span';

  return (
    <Wrapper
      type={aoClicar ? 'button' : undefined}
      onClick={aoClicar}
      className={aoClicar ? `inline-flex items-center justify-center ${className}` : className}
      {...rest}
    >
      <LucideIcon size={tamanho} color={cor} strokeWidth={1.8} />
    </Wrapper>
  );
};

export default Icone;
