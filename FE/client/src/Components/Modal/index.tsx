import { useEffect } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import Calendar from './Calendar';
import ChargeModal from './ChargeModal';
import PersonnelModal from './PersonnelModal';
import { SearchBarType } from '@Components/commons/baseType';
import { searchBarFocusAtom } from '@/recoil/atoms';
import LocationModal from './LocationModal';

type ModalType = {
  isSearchMap?: boolean;
}

const Modal = ({ isSearchMap }: ModalType) => {
  const [searchBarState, setSearchBarState] = useRecoilState(searchBarFocusAtom);
  const { location, entryDate, charge, personnel, focus } = searchBarState;

  const handleClickHideModal = (event: MouseEvent) => {
    const targetList = (event.target as HTMLElement);
    const checkTarget = targetList.closest('.Modal') || targetList.closest('.SearchBar');
    if (!checkTarget && focus) {
      setSearchBarState({
        location: false,
        entryDate: false,
        charge: false,
        personnel: false,
        focus: false
      });
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickHideModal);
    return () => document.removeEventListener('click', handleClickHideModal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);

  return (
    <ModalWrapper {...{ focus, isSearchMap }} className="Modal" >
      <LocationModal {...{ location }} />
      <Calendar {...{ entryDate }} />
      <ChargeModal {...{ charge }} />
      <PersonnelModal {...{ personnel }} />
    </ModalWrapper>
  )
}

// eslint-disable-next-line no-mixed-operators
type ModalWrapperType = SearchBarType & ModalType;

const ModalWrapper = styled.div<ModalWrapperType>`
  position: ${({ isSearchMap }) => isSearchMap ? 'fixed' : ''};
  top: 26%;
  left: 15%;
  z-index: 1;
  width: 70%;
  min-width: 35rem;
  margin:auto;
  display: ${({ focus }) => focus ? 'block' : 'none'};
`;

export default Modal;
