import { useNavigate } from "react-router";
import { BattleService } from "../services/battleService.js";
import { useBattleStore } from "../store/battle.js";
import { useRequest } from "./useRequest.js";
import { useEffect, useState } from "react";
import { ClientEndpoints } from "../types/endpoints.js";

export const useBattle = () => {
  const navigate = useNavigate();

  const { activeBattle } = useBattleStore();
  const [data, setData] = useState(activeBattle);

  const requestBattleData = async () => {
    if (activeBattle) {
      return;
    }

    const restoredBattle = await BattleService.restoreBattle();

    return setData(restoredBattle);
  };

  const {
    request: getBattleData,
    isLoading: battleDataLoading,
    isError: battleDataError,
  } = useRequest(requestBattleData);

  useEffect(() => {
    getBattleData();
  }, []);

  useEffect(() => {
    if (battleDataError) {
      navigate(ClientEndpoints.ROOT);
    }
  }, [battleDataError]);

  const attack = async () => {
    const updatedBattleState = await BattleService.attack();

    setData(updatedBattleState);
  };

  const {
    request: attackHandler,
    isLoading: attackLoading,
    isError: attackError,
  } = useRequest(attack);

  const isLoading = battleDataLoading || attackLoading;
  const isError = battleDataError || attackError;

  return { data, isLoading, isError, attack: attackHandler };
};
