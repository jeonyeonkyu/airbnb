import styled from 'styled-components';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { IconButton } from "@material-ui/core";
import { useRecoilState } from 'recoil';
import DateKind from './DateKind';
import { CalendarType } from '@Components/commons/baseType';
import { calendarClickAtom } from '@/recoil/atoms';
import { useCallback } from 'react';

type EntryDateType = CalendarType & {
  handleClickShowModal: (clickTarget: string) => () => void;
}

const EntryDate = ({ handleClickShowModal, entryDate }: EntryDateType) => {
  const [calendarClickState, setCalendarClickState] = useRecoilState(calendarClickAtom);
  const [checkInTime, checkOutTime] = calendarClickState;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleClickResetDay = useCallback(() => setCalendarClickState([]), []);

  return (
    <EntryDateWrapper onClick={handleClickShowModal('entryDate')}>
      <DateKind kind="체크인" checkInTime={checkInTime} />
      <DateKind kind="체크아웃" checkOutTime={checkOutTime} />
      <IconButton onClick={handleClickResetDay} style={{ visibility: entryDate ? 'visible' : 'hidden' }}>
        <HighlightOffIcon />
      </IconButton>
    </EntryDateWrapper>
  )
}

const EntryDateWrapper = styled.div`
  display: flex;
  width: 40%;
  margin-left: .5rem;
  border-right:1px solid #E0E0E0;
`;

export default EntryDate;
