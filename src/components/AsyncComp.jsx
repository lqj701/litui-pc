import Spinner from './Spinner';
import Loadable from 'react-loadable';

export default function asyncComp(loader) {
  return Loadable({ loader, loading: Spinner });
}
